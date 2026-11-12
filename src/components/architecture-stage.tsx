import type { ProjectId } from '../lib/routes';

type StageProps = {
  projectId: ProjectId;
  className?: string;
  compact?: boolean;
};

export function ArchitectureStage({
  projectId,
  className = '',
  compact = false,
}: StageProps) {
  return (
    <div
      className={`relative w-full min-h-full sm:h-full overflow-hidden rounded-[inherit] bg-[#0c0f14] text-[#eef0f2] border border-white/15 shadow-2xl select-none flex flex-col justify-between ${
        compact ? 'p-3.5 sm:p-5' : 'p-4 sm:p-7 md:p-8'
      } ${className}`}
    >
      {/* Subtle Blueprint Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top Window Header Bar */}
      <div className="relative z-10 flex items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="size-2.5 rounded-full bg-[#ff5f56] shrink-0" />
          <span className="size-2.5 rounded-full bg-[#ffbd2e] shrink-0" />
          <span className="size-2.5 rounded-full bg-[#27c93f] shrink-0" />
          <span className="ml-2 font-mono text-[10px] sm:text-xs tracking-wider uppercase text-white/65 truncate">
            {projectId === 'aws-multi-tier' && 'aws-3tier-vpc-architecture · Terraform IaC'}
            {projectId === 'amazon-eks' && 'amazon-eks-platform · Helm · HPA · IRSA'}
            {projectId === 'github-actions-cicd' && 'github-actions-pipeline · Trivy · ECR · Helm'}
            {projectId === 'terraform-remote-state' && 'terraform-remote-state · S3 · DynamoDB · KMS'}
            {projectId === 'aws-observability' && 'aws-observability · Prometheus · Grafana · Alertmanager'}
          </span>
        </div>
        <span className="rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 font-mono text-[10px] text-white/80 uppercase tracking-wider shrink-0">
          {projectId === 'aws-observability'
            ? 'Illustrative · Sample Data'
            : 'Illustrative Architecture'}
        </span>
      </div>

      {/* Main Diagram Body */}
      <div className="relative z-10 my-auto py-3 sm:py-4">
        {/* PROJECT 1: AWS Multi-Tier Infrastructure with Terraform */}
        {projectId === 'aws-multi-tier' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-white/65">
              <span>AWS MULTI-AZ VPC · PUBLIC / PRIVATE / DATABASE SUBNETS</span>
              <span className="text-[#ff8aa3]">MODULAR TERRAFORM</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="rounded-xl bg-white/[0.05] border border-white/10 p-3 space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#ff8aa3]">
                  Tier 1 · Presentation
                </div>
                <div className="font-display font-bold text-xs sm:text-sm">
                  IGW + ALB + NAT GW
                </div>
                <div className="text-[11px] text-white/65 leading-snug">
                  Public subnets, SSL/TLS termination, health-check target groups & path routing
                </div>
              </div>

              <div className="rounded-xl bg-white/[0.05] border border-white/10 p-3 space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300">
                  Tier 2 · Application
                </div>
                <div className="font-display font-bold text-xs sm:text-sm">
                  EC2 Auto Scaling
                </div>
                <div className="text-[11px] text-white/65 leading-snug">
                  Private app subnets, Launch Templates, self-healing compute & bastion access
                </div>
              </div>

              <div className="rounded-xl bg-white/[0.05] border border-white/10 p-3 space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-sky-300">
                  Tier 3 · Persistence
                </div>
                <div className="font-display font-bold text-xs sm:text-sm">
                  Multi-AZ RDS PostgreSQL
                </div>
                <div className="text-[11px] text-white/65 leading-snug">
                  Isolated DB subnets, KMS encryption at rest, automated snapshots & failover
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-black/50 border border-white/10 px-3 py-2 font-mono text-[10px] sm:text-[11px] text-white/75 flex flex-wrap items-center justify-between gap-2">
              <span>Security: Least-Privilege IAM + SG Ingress/Egress Isolation</span>
              <span className="text-emerald-400">Multi-AZ High Availability</span>
            </div>
          </div>
        )}

        {/* PROJECT 2: Amazon EKS Kubernetes Deployment Platform */}
        {projectId === 'amazon-eks' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-white/65">
              <span>AMAZON EKS CONTROL PLANE &amp; MANAGED EC2 NODE GROUPS</span>
              <span className="text-[#d0e266]">DOCKER · HELM · HPA · IRSA</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="rounded-xl bg-white/[0.05] border border-white/10 p-3 space-y-1.5">
                <span className="text-[10px] font-mono text-[#d0e266] uppercase">
                  Images &amp; Packaging
                </span>
                <p className="font-display font-bold text-xs sm:text-sm">
                  Amazon ECR + Helm Charts
                </p>
                <p className="text-[11px] text-white/65 leading-snug">
                  Multi-stage Docker builds; standardized Deployments, Services, ConfigMaps, Secrets &amp; Ingress
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.05] border border-white/10 p-3 space-y-1.5">
                <span className="text-[10px] font-mono text-[#d0e266] uppercase">
                  Worker Nodes &amp; Scaling
                </span>
                <p className="font-display font-bold text-xs sm:text-sm">
                  HPA + Health Probes
                </p>
                <p className="text-[11px] text-white/65 leading-snug">
                  CPU/memory Horizontal Pod Autoscaler, CoreDNS, liveness &amp; readiness probes
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.05] border border-white/10 p-3 space-y-1.5">
                <span className="text-[10px] font-mono text-[#d0e266] uppercase">
                  Pod-Level AWS IAM
                </span>
                <p className="font-display font-bold text-xs sm:text-sm">
                  IRSA ServiceAccounts
                </p>
                <p className="text-[11px] text-white/65 leading-snug">
                  Fine-grained AWS permissions bound directly to Kubernetes pods
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-black/50 border border-white/10 px-3 py-2 font-mono text-[10px] sm:text-[11px] text-white/75 flex flex-wrap items-center justify-between gap-2">
              <span>Rolling Updates: Liveness + Readiness Gate Verification</span>
              <span className="text-[#d0e266]">Zero-Downtime Rollouts</span>
            </div>
          </div>
        )}

        {/* PROJECT 3: GitHub Actions CI/CD Automation */}
        {projectId === 'github-actions-cicd' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-white/65">
              <span>END-TO-END AUTOMATED GITHUB ACTIONS GITOPS PIPELINE</span>
              <span className="text-sky-300">OIDC + TRIVY + HELM</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { step: '01 · Code Change', label: 'PR / Merge Trigger', meta: 'Multi-stage workflow' },
                { step: '02 · Validation', label: 'Lint & Unit Tests', meta: 'Automated quality gate' },
                { step: '03 · Build', label: 'Docker + SemVer Tag', meta: 'Container artifact' },
                { step: '04 · Security', label: 'Trivy CVE Scan', meta: 'Image vulnerability check' },
                { step: '05 · Publish', label: 'OIDC → Amazon ECR', meta: 'Least-privilege IAM' },
                { step: '06 · Release', label: 'Helm Upgrade + Verify', meta: 'Health check gate' },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl bg-white/[0.05] border border-white/10 p-2.5 space-y-1"
                >
                  <div className="text-[10px] font-mono text-sky-300">{item.step}</div>
                  <div className="font-display font-bold text-xs">{item.label}</div>
                  <div className="text-[10px] font-mono text-white/60">{item.meta}</div>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-amber-500/10 border border-amber-400/25 px-3 py-2 font-mono text-[10px] sm:text-[11px] text-amber-200 flex flex-wrap items-center justify-between gap-2">
              <span>Safeguard Branch: Post-Deploy Health Check Failure</span>
              <span className="font-semibold">→ Automated Helm Rollback Trigger</span>
            </div>
          </div>
        )}

        {/* PROJECT 4: Terraform Remote State & Multi-Environment Automation */}
        {projectId === 'terraform-remote-state' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-white/65">
              <span>CENTRALIZED TERRAFORM REMOTE STATE &amp; LOCKING TOPOLOGY</span>
              <span className="text-emerald-300">S3 · DYNAMODB · KMS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="rounded-xl bg-white/[0.05] border border-white/10 p-3 space-y-1.5">
                <div className="text-[10px] font-mono text-emerald-300 uppercase">
                  State Storage &amp; Crypto
                </div>
                <div className="font-display font-bold text-xs sm:text-sm">
                  Amazon S3 + AWS KMS
                </div>
                <p className="text-[11px] text-white/65 leading-snug">
                  Bucket versioning, server-side KMS encryption, public-access blocks &amp; IAM policies
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.05] border border-white/10 p-3 space-y-1.5">
                <div className="text-[10px] font-mono text-emerald-300 uppercase">
                  Concurrency Control
                </div>
                <div className="font-display font-bold text-xs sm:text-sm">
                  DynamoDB State Locking
                </div>
                <p className="text-[11px] text-white/65 leading-snug">
                  Prevents simultaneous state modifications and concurrent execution conflicts
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.05] border border-white/10 p-3 space-y-1.5">
                <div className="text-[10px] font-mono text-emerald-300 uppercase">
                  Environment Isolation
                </div>
                <div className="font-display font-bold text-xs sm:text-sm">
                  Dev · Staging · Prod
                </div>
                <p className="text-[11px] text-white/65 leading-snug">
                  Terraform Workspaces, environment .tfvars, fmt/validate &amp; drift checks
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PROJECT 5: AWS Observability with Prometheus & Grafana */}
        {projectId === 'aws-observability' && (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-white/65">
              <span>PROMETHEUS, GRAFANA &amp; ALERTMANAGER TELEMETRY TOPOLOGY</span>
              <span className="text-[#f0587a]">SAMPLE DASHBOARD PREVIEW</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="rounded-xl bg-white/[0.05] border border-white/10 p-3 space-y-1.5">
                <div className="text-[10px] font-mono text-[#ff8aa3] uppercase">
                  Exporters &amp; Logs
                </div>
                <div className="font-display font-bold text-xs sm:text-sm">
                  Node + kube-state-metrics
                </div>
                <p className="text-[11px] text-white/65 leading-snug">
                  Cluster/node telemetry + CloudWatch Logs &amp; Alarms integration
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.05] border border-white/10 p-3 space-y-1.5">
                <div className="text-[10px] font-mono text-[#ff8aa3] uppercase">
                  PromQL &amp; Grafana
                </div>
                <div className="font-display font-bold text-xs sm:text-sm">
                  Cluster Health Dashboards
                </div>
                <p className="text-[11px] text-white/65 leading-snug">
                  CPU/memory saturation, pod restarts, network throughput &amp; latency (Sample View)
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.05] border border-white/10 p-3 space-y-1.5">
                <div className="text-[10px] font-mono text-[#ff8aa3] uppercase">
                  Incident Routing
                </div>
                <div className="font-display font-bold text-xs sm:text-sm">
                  Alertmanager Webhooks
                </div>
                <p className="text-[11px] text-white/65 leading-snug">
                  SLA breach &amp; error-rate rules routed to Slack channels &amp; responder email
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Caption */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10 text-[10px] sm:text-[11px] font-mono text-white/55">
        <span>Saivinod Kotipalli · AWS DevOps Architecture</span>
        <span>
          {projectId === 'aws-observability'
            ? 'Sample Telemetry Preview'
            : 'System Topology Diagram'}
        </span>
      </div>
    </div>
  );
}
