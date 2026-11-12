import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

// Field length constraints
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 180;
const MAX_MESSAGE_LENGTH = 5000;

// Rate limit configuration: max 5 contact submissions per 15 minutes per IP
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

interface RateLimitEntry {
  timestamps: number[];
}

const ipRateLimits = new Map<string, RateLimitEntry>();

// Periodically prune expired rate-limit entries
setInterval(() => {
  const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS;
  for (const [ip, entry] of ipRateLimits.entries()) {
    const active = entry.timestamps.filter((ts) => ts > cutoff);
    if (active.length === 0) {
      ipRateLimits.delete(ip);
    } else {
      entry.timestamps = active;
    }
  }
}, 5 * 60 * 1000).unref();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

function isRateLimited(ip: string): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const existing = ipRateLimits.get(ip) ?? { timestamps: [] };
  const active = existing.timestamps.filter((ts) => ts > cutoff);

  if (active.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldest = active[0];
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000)
    );
    ipRateLimits.set(ip, { timestamps: active });
    return { limited: true, retryAfterSeconds };
  }

  active.push(now);
  ipRateLimits.set(ip, { timestamps: active });
  return { limited: false, retryAfterSeconds: 0 };
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function hasHeaderInjection(value: string): boolean {
  if (/[\r\n\0]/.test(value) || /%0[ad]/i.test(value)) {
    return true;
  }
  if (
    /(?:^|\s)(?:bcc|cc|to|from|reply-to|content-type|mime-version|subject)\s*:/i.test(
      value
    )
  ) {
    return true;
  }
  return false;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isPlaceholderOrMissing(value: string | undefined): boolean {
  if (!value) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (
    trimmed.includes('<NEW_APP_PASSWORD') ||
    trimmed.includes('YOUR_') ||
    trimmed === 'MY_GMAIL_APP_PASSWORD' ||
    trimmed === 'REPLACE_ME'
  ) {
    return true;
  }
  return false;
}

async function startServer() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Parse JSON exclusively for /api/contact with a strict 16kb body size limit
  app.post(
    '/api/contact',
    express.json({ limit: '16kb' }),
    async (req: Request, res: Response) => {
      const clientIp = getClientIp(req);

      // 1. Honeypot check (bots filling hidden field)
      const rawBody =
        req.body && typeof req.body === 'object'
          ? (req.body as Record<string, unknown>)
          : {};
      const honeypot =
        typeof rawBody.website === 'string'
          ? rawBody.website.trim()
          : typeof rawBody._gotcha === 'string'
            ? rawBody._gotcha.trim()
            : '';

      if (honeypot.length > 0) {
        res.status(400).json({
          ok: false,
          code: 'VALIDATION_ERROR',
          error: 'Unable to process your submission.',
        });
        return;
      }

      // 2. Validate required fields, types, lengths, email format, and header-injection safety
      const name = typeof rawBody.name === 'string' ? rawBody.name.trim() : '';
      const email = typeof rawBody.email === 'string' ? rawBody.email.trim() : '';
      const subject =
        typeof rawBody.subject === 'string' ? rawBody.subject.trim() : '';
      const message =
        typeof rawBody.message === 'string' ? rawBody.message.trim() : '';

      if (!name) {
        res.status(400).json({
          ok: false,
          code: 'VALIDATION_ERROR',
          error: 'Please enter your name.',
        });
        return;
      }

      if (name.length > MAX_NAME_LENGTH) {
        res.status(400).json({
          ok: false,
          code: 'VALIDATION_ERROR',
          error: `Name must be ${MAX_NAME_LENGTH} characters or fewer.`,
        });
        return;
      }

      if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)) {
        res.status(400).json({
          ok: false,
          code: 'VALIDATION_ERROR',
          error: 'Please enter a valid email address.',
        });
        return;
      }

      if (subject.length > MAX_SUBJECT_LENGTH) {
        res.status(400).json({
          ok: false,
          code: 'VALIDATION_ERROR',
          error: `Subject must be ${MAX_SUBJECT_LENGTH} characters or fewer.`,
        });
        return;
      }

      if (!message) {
        res.status(400).json({
          ok: false,
          code: 'VALIDATION_ERROR',
          error: 'Please enter a message before sending.',
        });
        return;
      }

      if (message.length > MAX_MESSAGE_LENGTH) {
        res.status(400).json({
          ok: false,
          code: 'VALIDATION_ERROR',
          error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer.`,
        });
        return;
      }

      if (
        hasHeaderInjection(name) ||
        hasHeaderInjection(email) ||
        hasHeaderInjection(subject)
      ) {
        res.status(400).json({
          ok: false,
          code: 'HEADER_INJECTION',
          error: 'Invalid characters detected in contact fields.',
        });
        return;
      }

      // 3. Enforce per-IP rate limiting
      const rateStatus = isRateLimited(clientIp);
      if (rateStatus.limited) {
        res.setHeader('Retry-After', String(rateStatus.retryAfterSeconds));
        res.status(429).json({
          ok: false,
          code: 'RATE_LIMITED',
          error:
            'Too many messages sent recently. Please wait a few minutes and try again.',
        });
        return;
      }

      // 4. Verify server-side SMTP configuration (never simulate success if missing)
      const gmailUser = process.env.GMAIL_USER?.trim();
      const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.trim();
      const contactTo = process.env.CONTACT_TO?.trim();

      if (
        isPlaceholderOrMissing(gmailUser) ||
        isPlaceholderOrMissing(gmailAppPassword) ||
        isPlaceholderOrMissing(contactTo) ||
        !EMAIL_REGEX.test(gmailUser!) ||
        !EMAIL_REGEX.test(contactTo!)
      ) {
        res.status(503).json({
          ok: false,
          code: 'UNCONFIGURED',
          error:
            'Email delivery is not configured on the server yet. Please set GMAIL_USER, GMAIL_APP_PASSWORD, and CONTACT_TO in hosting secrets, or reach out directly by email.',
        });
        return;
      }

      // 5. Configure Nodemailer for Gmail SMTP over explicit STARTTLS on port 587
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
        tls: {
          rejectUnauthorized: true,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
      });

      const resolvedSubjectSuffix = subject || 'New inquiry';
      const emailSubject = `Portfolio Contact: ${resolvedSubjectSuffix}`;

      const textBody = [
        'New portfolio contact form submission:',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${resolvedSubjectSuffix}`,
        '',
        'Message:',
        message,
      ].join('\n');

      const escapedName = escapeHtml(name);
      const escapedEmail = escapeHtml(email);
      const escapedSubject = escapeHtml(resolvedSubjectSuffix);
      const escapedMessage = escapeHtml(message).replace(/\r?\n/g, '<br />');

      const htmlBody = `<!DOCTYPE html>
<html lang="en">
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111315; line-height: 1.6;">
    <h2 style="margin: 0 0 16px;">Portfolio Contact Submission</h2>
    <p style="margin: 4px 0;"><strong>Name:</strong> ${escapedName}</p>
    <p style="margin: 4px 0;"><strong>Email:</strong> ${escapedEmail}</p>
    <p style="margin: 4px 0;"><strong>Subject:</strong> ${escapedSubject}</p>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
    <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
    <div style="white-space: pre-wrap;">${escapedMessage}</div>
  </body>
</html>`;

      try {
        const info = await transporter.sendMail({
          from: gmailUser,
          to: contactTo,
          replyTo: email,
          subject: emailSubject,
          text: textBody,
          html: htmlBody,
        });

        const acceptedCount = Array.isArray(info.accepted)
          ? info.accepted.length
          : 0;

        if (acceptedCount === 0) {
          res.status(502).json({
            ok: false,
            code: 'SMTP_REJECTED',
            error:
              'The mail server did not accept the message for delivery. Please try again later or email directly.',
          });
          return;
        }

        res.status(200).json({
          ok: true,
          message: 'Your message has been submitted. Thank you!',
        });
      } catch (err: unknown) {
        const smtpError = err as {
          code?: string;
          responseCode?: number;
        };

        if (
          smtpError?.code === 'EAUTH' ||
          smtpError?.responseCode === 535 ||
          smtpError?.responseCode === 534
        ) {
          res.status(502).json({
            ok: false,
            code: 'SMTP_AUTH_ERROR',
            error:
              'Mail server authentication failed. Please verify the server Gmail App Password configuration or reach out directly by email.',
          });
          return;
        }

        if (
          smtpError?.responseCode === 421 ||
          smtpError?.responseCode === 450 ||
          smtpError?.responseCode === 451 ||
          smtpError?.responseCode === 452 ||
          smtpError?.responseCode === 554
        ) {
          res.status(429).json({
            ok: false,
            code: 'SMTP_LIMIT',
            error:
              'Email sending limit reached temporarily. Please try again later or email me directly.',
          });
          return;
        }

        res.status(502).json({
          ok: false,
          code: 'SMTP_SEND_ERROR',
          error:
            'Unable to send your message right now. Please try again in a moment or email me directly.',
        });
      }
    }
  );

  // Handle JSON body-parser errors (such as 413 Payload Too Large or malformed JSON)
  app.use(
    '/api/contact',
    (err: { type?: string; status?: number }, _req: Request, res: Response, next: NextFunction) => {
      if (err?.type === 'entity.too.large' || err?.status === 413) {
        res.status(413).json({
          ok: false,
          code: 'PAYLOAD_TOO_LARGE',
          error: 'Your message is too large. Please shorten it and try again.',
        });
        return;
      }
      if (err) {
        res.status(400).json({
          ok: false,
          code: 'INVALID_REQUEST',
          error: 'Invalid request payload.',
        });
        return;
      }
      next();
    }
  );

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
