import { personalInfo } from './content';

export function hasResumePdf(): boolean {
  return Boolean(personalInfo.resumePdfUrl && personalInfo.resumePdfUrl.trim().length > 0);
}

export function downloadResumePdf() {
  if (!hasResumePdf()) return;
  const a = document.createElement('a');
  a.href = personalInfo.resumePdfUrl;
  a.download = `${personalInfo.firstName}_${personalInfo.lastName}_Resume.pdf`;
  a.rel = 'noopener noreferrer';
  a.click();
}
