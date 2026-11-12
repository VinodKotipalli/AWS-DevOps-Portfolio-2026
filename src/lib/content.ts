import type { ProjectId } from './routes';

export type Metric = { value: string; label: string };
export type Flow = { label: string; steps: string[] };
export type Decision = {
  title: string;
  body: string;
  flows?: Flow[];
  codeTitle?: string;
  codeLines?: string[];
};

export type Project = {
  id: ProjectId;
  indexNumber: string;
  name: string;
  shortName: string;
  subtitle: string;
  sourceSubtitle?: string;
  category: string;
  description: string;
  role: string;
  scope: string;
  technologies: string[];
  implementationDetails: string[];
  color: string;
  ink: string;
  accent: string;
  featured: boolean;
  repositoryUrl?: string;
  demoUrl?: string;
  architectureFlows: Flow[];
};

export type ProjectConfig = Project;

export type Note = {
  id: string;
  part: string;
  title: string;
  text: string;
  side: 'left' | 'right';
  pin: [number, number];
  box: [number, number, number, number];
};

export type Achievement = {
  metric: string;
  title: string;
  description: string;
};

export type Certification = {
  index: string;
  name: string;
  code: string;
  issuer: string;
  issued: string;
  expires?: string;
  skills: string[];
  description: string;
};

// ============================================================================
// PORTFOLIO CONTENT CONFIGURATION — SAIVINOD KOTIPALLI
// Extracted from https://saivinodportfolio.site/
// ============================================================================

export const photos = {
  // Set heroPortrait to your own portrait path (e.g. '/assets/saivinod-portrait.png') when ready
  heroPortrait: null as string | null,
  heroBackground: null as string | null,
  flattenedReferenceImage: null as string | null,
  useFlattenedImageOnly: false,
  inlineChip: null as string | null,
  aboutPortrait: null as string | null,
  beyondPhoto:
    '/src/assets/images/cloud_infrastructure_topology_1794516625884.jpg',
};

export const heroConfig = {
  headingWords: ['SAIVINOD', 'KOTIPALLI'],
  headingFull: 'SAIVINOD KOTIPALLI',
  role: 'AWS DevOps Engineer',
  subRole: 'Site Reliability & Cloud Infrastructure Automation',
  specialties: [
    'AWS Cloud Architecture',
    'Terraform IaC',
    'Prometheus & Grafana',
    'Amazon EKS & Docker',
    'Jenkins & GitHub Actions',
  ],
  descriptionLines: [
    'I design, automate and scale',
    'AI-ready infrastructure.',
  ],
  ctaLabel: 'View My Work',
  ctaTarget: '#projects',
};

export const personalInfo = {
  name: 'Saivinod Kotipalli',
  firstName: 'Saivinod',
  lastName: 'Kotipalli',
  initials: 'sk.',
  greeting: 'Hi, I’m Saivinod Kotipalli',
  role: 'AWS DevOps Engineer',
  extendedTitle: 'AWS DevOps Engineer | Site Reliability & DevOps',
  location: 'Srikakulam, Andhra Pradesh',
  employmentLocation: 'Hyderabad',
  phone: {
    display: '+91 8520899337',
    href: 'tel:+918520899337',
  },
  email: {
    address: 'saivinodkotipalli2003@gmail.com',
    href: 'mailto:saivinodkotipalli2003@gmail.com',
  },
  whatsapp: 'https://wa.me/918520899337',
  github: 'https://github.com/VinodKotipalli',
  linkedin: 'https://www.linkedin.com/in/saivinod-kotipalli-960aa61a0',
  instagram: 'https://instagram.com/saivinod.kotipalli',
  resumePdfUrl: '',
  heroBadges: ['2+ years', '99.9% uptime target'],
  heroIntro:
    'AWS DevOps Engineer with 2+ years across cloud monitoring, infrastructure automation and SRE. Cut release cycles from weekly to daily, reduced infrastructure provisioning time by 80%.',
  professionalSummary:
    'AWS DevOps Engineer with 2+ years across cloud monitoring, infrastructure automation and SRE. Cut release cycles from weekly to daily, reduced infrastructure provisioning time by 80%, and maintained zero critical security findings through automated compliance controls. Dual AWS-certified (Solutions Architect and CloudOps Engineer Associate). Builds with Terraform, Jenkins, Prometheus and Grafana, and works closely with DevOps, SRE and application teams.',
};

export const contactLinks = [
  {
    label: 'Email',
    value: 'saivinodkotipalli2003@gmail.com',
    href: 'mailto:saivinodkotipalli2003@gmail.com',
    external: false,
  },
  {
    label: 'Phone',
    value: '+91 8520899337',
    href: 'tel:+918520899337',
    external: false,
  },
  {
    label: 'WhatsApp',
    value: 'WhatsApp',
    href: 'https://wa.me/918520899337',
    external: true,
  },
  {
    label: 'LinkedIn',
    value: 'LinkedIn',
    href: 'https://www.linkedin.com/in/saivinod-kotipalli-960aa61a0',
    external: true,
  },
  {
    label: 'GitHub',
    value: 'GitHub',
    href: 'https://github.com/VinodKotipalli',
    external: true,
  },
  {
    label: 'Instagram',
    value: 'Instagram',
    href: 'https://instagram.com/saivinod.kotipalli',
    external: true,
  },
];

// Handwritten portrait annotations positioned relative to the portrait container
export const heroNotes: Note[] = [
  {
    id: 'eyes',
    part: 'Eyes',
    title: 'I plan before I build',
    text: 'I plan before I build',
    side: 'left',
    // Target point near the subject's right eye (viewer's left)
    pin: [0.43, 0.255],
    // [cardAnchorX, cardAnchorY, controlOffsetX, controlOffsetY]
    box: [0.06, 0.22, 0.28, 0.19],
  },
  {
    id: 'head',
    part: 'Head',
    title: 'I turn ideas into solutions',
    text: 'I turn ideas into solutions',
    side: 'right',
    // Target point near the temple/head on viewer's right
    pin: [0.58, 0.195],
    box: [0.76, 0.17, 0.69, 0.14],
  },
  {
    id: 'heart',
    part: 'Heart',
    title: 'I stay curious, near and far',
    text: 'I stay curious, near and far',
    side: 'right',
    // Target point over the anatomical heart / left chest pocket
    pin: [0.56, 0.54],
    box: [0.77, 0.48, 0.68, 0.49],
  },
  {
    id: 'buttons',
    part: 'Buttons',
    title: 'I build, deploy and improve',
    text: 'I build, deploy and improve',
    side: 'left',
    // Target point on the center shirt buttons
    pin: [0.485, 0.61],
    box: [0.08, 0.56, 0.31, 0.63],
  },
];

// Section 3: About / Professional Summary & Capability Columns
export const approachConfig = {
  statementBeforeChip:
    'AWS DevOps Engineer with 2+ years across cloud monitoring, infrastructure automation and SRE. Cut release cycles from weekly to daily, reduced infrastructure provisioning time by 80%, and maintained zero critical security findings through automated compliance',
  statementAfterChip:
    'controls. Dual AWS-certified (Solutions Architect and CloudOps Engineer Associate). Builds with Terraform, Jenkins, Prometheus and Grafana, and works closely with DevOps, SRE and application teams.',
  highlightedAreas: [
    'AWS Cloud Infrastructure',
    'Terraform IaC',
    'Prometheus & Grafana',
    'Jenkins CI/CD',
    'Node Exporter & PromQL',
    'Alertmanager & SRE',
    'AWS Well-Architected Framework',
    'Incident Response & MTTD Reduction',
  ],
  capabilities: [
    {
      title: 'Infrastructure & Automation',
      text: 'Designing resilient multi-AZ AWS topologies and codifying repeatable infrastructure with Terraform, AWS CloudFormation, and Ansible.',
      tools: [
        'AWS Cloud Infrastructure',
        'Terraform IaC',
        'VPC & Multi-AZ Networking',
        'IAM & KMS Security',
        'AWS Well-Architected Framework',
      ],
    },
    {
      title: 'Delivery & Orchestration',
      text: 'Accelerating release cadence from weekly to daily with Jenkins and GitHub Actions pipelines, Docker containerization, Amazon EKS, and Helm.',
      tools: [
        'Jenkins CI/CD',
        'GitHub Actions',
        'Amazon EKS & Kubernetes',
        'Docker & Helm',
        'GitOps Automation',
      ],
    },
    {
      title: 'Observability & Reliability',
      text: 'Building centralized Prometheus, Grafana, Node Exporter, and Alertmanager platforms to improve visibility, reduce alert fatigue, and lower MTTD.',
      tools: [
        'Prometheus & Grafana',
        'Node Exporter & PromQL',
        'Alertmanager & SRE',
        'CloudWatch & Dynatrace',
        'Incident Response & MTTD Reduction',
      ],
    },
  ],
};

// Section 6: Overall Professional Achievements (Source-listed)
export const achievements: Achievement[] = [
  {
    metric: 'Weekly → Daily',
    title: 'Release Acceleration',
    description:
      'Reduced application release cycles from weekly to daily by standardizing CI/CD workflows and deployment automation.',
  },
  {
    metric: '80% Reduction',
    title: 'IaC Provisioning Speed',
    description:
      'Accelerated infrastructure delivery with reusable Infrastructure as Code templates, reducing provisioning time by 80%.',
  },
  {
    metric: '0 Critical Issues',
    title: 'Cloud Governance & Security',
    description:
      'Strengthened cloud governance and security through automated compliance controls, encryption, and least-privilege access, resulting in zero critical security findings.',
  },
];

// Section 7: All Five Supplied Projects
// Projects 1–3: Three full-screen stacking panels (Raspberry, Bright Lime, Cobalt Blue)
// Projects 4–5: Secondary project list with interactive previews
export const projects: Project[] = [
  {
    id: 'aws-multi-tier',
    indexNumber: '01',
    name: 'AWS Multi-Tier Infrastructure with Terraform',
    shortName: 'AWS Multi-Tier Infrastructure',
    subtitle: 'Enterprise 3-Tier Cloud Architecture & Automated Infrastructure as Code',
    category: 'Cloud Infrastructure & IaC',
    description:
      'Designed and automated a scalable, highly available three-tier cloud infrastructure on AWS using reusable Terraform modules. The architecture isolates presentation, application logic, and persistence layers across multiple Availability Zones with dedicated public/private subnets, automated load balancing, Auto Scaling, and centralized security controls.',
    role: 'AWS DevOps Engineer',
    scope: 'VPC · ALB · EC2 Auto Scaling · Multi-AZ RDS · IAM · Terraform',
    technologies: [
      'Terraform',
      'AWS',
      'VPC',
      'EC2',
      'Application Load Balancer',
      'Amazon RDS',
      'Auto Scaling',
      'IAM',
      'Security Groups',
      'Linux',
    ],
    implementationDetails: [
      'Automated complete AWS infrastructure provisioning using modular, reusable Terraform configurations.',
      'Configured public subnets, private application subnets, database subnets, Internet Gateways, and NAT Gateways across multiple Availability Zones.',
      'Implemented Application Load Balancers with health-check target groups, SSL/TLS termination, and path-based routing.',
      'Deployed Launch Templates and Auto Scaling Groups for elastic scaling and self-healing compute capacity.',
      'Configured Multi-AZ Amazon RDS PostgreSQL with automated snapshots, KMS encryption at rest, and automated failover.',
      'Enforced least-privilege IAM policies, security-group ingress/egress isolation, and secure bastion-host access.',
    ],
    color: '#b52845',
    ink: '#f0e7e6',
    accent: '#ff8aa3',
    featured: true,
    repositoryUrl: undefined,
    demoUrl: undefined,
    architectureFlows: [
      {
        label: '3-Tier Multi-AZ Request & Isolation Flow',
        steps: [
          'Internet Gateway',
          'Public Subnets (ALB + NAT GW)',
          'Private App Subnets (EC2 Auto Scaling)',
          'Database Subnets (Multi-AZ RDS PostgreSQL)',
        ],
      },
    ],
  },
  {
    id: 'amazon-eks',
    indexNumber: '02',
    name: 'Amazon EKS Kubernetes Deployment Platform',
    shortName: 'Amazon EKS Platform',
    subtitle: 'Production Container Orchestration, Microservices & Elastic Pod Autoscaling',
    category: 'Containerization & Orchestration',
    description:
      'Architected and deployed a resilient Kubernetes container platform on Amazon EKS for running microservices workloads. Containerized applications with Docker, packaged deployment manifests into Helm charts, and configured autoscaling policies with secure IAM Roles for Service Accounts.',
    role: 'AWS DevOps Engineer',
    scope: 'Amazon EKS · Kubernetes · Docker · Helm · ECR · HPA · IRSA',
    technologies: [
      'Amazon EKS',
      'Kubernetes',
      'Docker',
      'Helm',
      'Amazon ECR',
      'HPA',
      'IRSA',
      'CoreDNS',
      'Linux',
    ],
    implementationDetails: [
      'Provisioned the Amazon EKS control plane and managed EC2 worker-node groups using infrastructure as code.',
      'Containerized backend and frontend microservices using multi-stage Docker builds optimized for minimal image footprint.',
      'Created standardized Helm charts for Deployments, Services, ConfigMaps, Secrets, and Ingress resources.',
      'Configured Horizontal Pod Autoscaler policies based on CPU and memory utilization thresholds.',
      'Configured liveness and readiness probes for self-healing and zero-downtime rolling updates.',
      'Implemented IRSA to grant fine-grained AWS permissions to Kubernetes pods.',
    ],
    color: '#d0e266',
    ink: '#101714',
    accent: '#101714',
    featured: true,
    repositoryUrl: undefined,
    demoUrl: undefined,
    architectureFlows: [
      {
        label: 'Container Packaging & EKS Orchestration Flow',
        steps: [
          'Multi-Stage Docker Build',
          'Amazon ECR Registry',
          'Helm Chart Release',
          'EKS Worker Nodes + HPA + IRSA',
        ],
      },
    ],
  },
  {
    id: 'github-actions-cicd',
    indexNumber: '03',
    name: 'GitHub Actions CI/CD Automation',
    shortName: 'GitHub Actions CI/CD',
    subtitle: 'End-to-End Automated Build, Security Scan & GitOps Deployment Pipeline',
    category: 'CI/CD & DevOps Automation',
    description:
      'Engineered an automated end-to-end CI/CD pipeline using GitHub Actions. The pipeline automates code validation, container security scans, artifact publishing to Amazon ECR, and deployments to Kubernetes clusters with rollback safeguards.',
    role: 'AWS DevOps Engineer',
    scope: 'GitHub Actions · Docker · Trivy · Amazon ECR · Helm · OIDC',
    technologies: [
      'GitHub Actions',
      'Docker',
      'Amazon ECR',
      'Helm',
      'Trivy',
      'GitOps',
      'Bash',
      'AWS CLI',
    ],
    implementationDetails: [
      'Constructed multi-stage workflows triggered on pull requests and branch merges.',
      'Integrated code linting, unit testing, and container-image vulnerability scanning with Trivy.',
      'Automated Docker builds, semantic-version tagging, and secure publishing to Amazon ECR.',
      'Automated Helm upgrades and rolling releases on target Kubernetes environments upon merge.',
      'Configured deployment verification and post-deployment health checks with automated rollback triggers.',
      'Secured credentials using GitHub Encrypted Secrets, OpenID Connect, and least-privilege IAM roles.',
    ],
    color: '#2d5bcc',
    ink: '#e2e9f5',
    accent: '#ffffff',
    featured: true,
    repositoryUrl: undefined,
    demoUrl: undefined,
    architectureFlows: [
      {
        label: 'CI/CD Pipeline & Rollback Safeguard Sequence',
        steps: [
          'Code Change (PR / Merge)',
          'Validation & Unit Tests',
          'Docker Image Build',
          'Trivy Vulnerability Scan',
          'OIDC Push to Amazon ECR',
          'Helm Deployment → Health Verification / Rollback',
        ],
      },
    ],
  },
  {
    id: 'terraform-remote-state',
    indexNumber: '04',
    name: 'Terraform Remote State & Multi-Environment Automation',
    shortName: 'Terraform Remote State',
    subtitle: 'Remote State, DynamoDB Locking & Environment Isolation',
    sourceSubtitle:
      'Enterprise State Management, S3 Locking, KMS Encryption & Environment Workspaces',
    category: 'Infrastructure as Code (IaC)',
    description:
      'Implemented secure, centralized remote-state management for Terraform with state locking and isolation for Dev, Staging, and Production. Prevented concurrent execution conflicts and enforced cryptographic security for infrastructure state files.',
    role: 'AWS DevOps Engineer',
    scope: 'Terraform · Amazon S3 · DynamoDB Locking · AWS KMS · Workspaces',
    technologies: [
      'Terraform',
      'Amazon S3',
      'DynamoDB',
      'AWS KMS',
      'Terraform Workspaces',
      'IAM',
      'Bash',
    ],
    implementationDetails: [
      'Configured an S3 remote-state backend with versioning, server-side AWS KMS encryption, and public-access blocks.',
      'Implemented a DynamoDB state-locking table to prevent simultaneous state modifications and race conditions.',
      'Structured environment parameterization using Terraform Workspaces and environment-specific .tfvars files.',
      'Built modular infrastructure components with strict input-type constraints and validation rules.',
      'Automated terraform fmt, terraform validate, and drift-detection checks.',
      'Enforced IAM bucket policies restricting state access to authorized automation roles and administrators.',
    ],
    color: '#1e5b4f',
    ink: '#e3efe9',
    accent: '#a9e4cf',
    featured: false,
    repositoryUrl: undefined,
    demoUrl: undefined,
    architectureFlows: [
      {
        label: 'Remote State Governance & Environment Isolation Flow',
        steps: [
          'Terraform CLI (fmt / validate)',
          'Workspace Selection (Dev / Staging / Prod)',
          'DynamoDB State Lock Lease',
          'S3 Backend + AWS KMS Encryption',
        ],
      },
    ],
  },
  {
    id: 'aws-observability',
    indexNumber: '05',
    name: 'AWS Observability with Prometheus & Grafana',
    shortName: 'AWS Observability Platform',
    subtitle: 'Real-Time Telemetry, Cluster Health Dashboards & Alertmanager Notification System',
    category: 'Monitoring & Observability',
    description:
      'Deployed a full-stack observability platform on AWS using Prometheus, Grafana, and Alertmanager. Provided visibility into Kubernetes workloads, node resource saturation, application request rates, latency distributions, and operational alerts.',
    role: 'AWS DevOps Engineer',
    scope: 'Prometheus · Grafana · Alertmanager · Node Exporter · CloudWatch',
    technologies: [
      'Prometheus',
      'Grafana',
      'Amazon CloudWatch',
      'Alertmanager',
      'Node Exporter',
      'kube-state-metrics',
      'PromQL',
      'Slack Webhooks',
    ],
    implementationDetails: [
      'Deployed Prometheus, kube-state-metrics, and Node Exporters to collect cluster and infrastructure telemetry.',
      'Designed Grafana dashboards for CPU/memory utilization, pod restarts, network throughput, and response latency.',
      'Constructed PromQL alerting rules for SLA breaches, elevated error rates, and resource bottlenecks.',
      'Configured Alertmanager routing to Slack channels and incident-responder email.',
      'Integrated CloudWatch Logs and CloudWatch Alarms for AWS managed-service monitoring.',
      'Improved observability and reduced MTTD and MTTR; no numeric reduction is supplied.',
    ],
    color: '#2b0d17',
    ink: '#f5b8cb',
    accent: '#f0587a',
    featured: false,
    repositoryUrl: undefined,
    demoUrl: undefined,
    architectureFlows: [
      {
        label: 'Telemetry Scrape & Alert Routing Flow',
        steps: [
          'Node Exporter + kube-state-metrics + CloudWatch',
          'Prometheus Scrape & PromQL Rules',
          'Grafana Dashboards',
          'Alertmanager → Slack & Email',
        ],
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const workProjects = projects;
export const toolProjects = projects.filter((p) => !p.featured);

export function projectById(id: ProjectId): Project {
  return projects.find((p) => p.id === id) ?? projects[0];
}

export const projectNames: Record<string, string> = Object.fromEntries(
  projects.map((p) => [p.id, p.shortName])
);

// Section 5: Professional Experience (Tata Consultancy Services)
export const experience = [
  {
    role: 'AWS DevOps Engineer',
    company: 'Tata Consultancy Services (TCS)',
    location: 'Hyderabad',
    dates: 'June 2024 – Present',
    employmentType: 'Full-time',
    highlights: [
      'Designed, deployed, and maintained a centralized Prometheus and Grafana monitoring platform, delivering real-time visibility into infrastructure health across multiple Linux servers and cloud environments.',
      'Automated provisioning of monitoring infrastructure using Terraform, enabling consistent, version-controlled, repeatable deployment of Prometheus, Grafana, and Node Exporter across environments.',
      'Integrated Jenkins CI/CD pipelines with the monitoring stack to validate post-deployment application health and trigger automated alerts on failed builds, accelerating release cycles from weekly to daily.',
      'Installed and configured Node Exporter on Linux servers to collect CPU, memory, disk, filesystem, network, and system load metrics. Configured Prometheus scrape jobs, service discovery, recording rules, and alerting rules.',
      'Developed interactive Grafana dashboards using PromQL to visualize infrastructure performance, server availability, application health, and resource utilization.',
      'Integrated Alertmanager with email and Slack for automated alerting on CPU, memory, disk, and service downtime. Tuned thresholds, grouping, and deduplication to reduce alert fatigue and improve incident response.',
      'Monitored AWS EC2 instances, Linux servers, and Docker containers. Performed proactive capacity planning and troubleshot exporter, scrape, and connectivity issues.',
      'Applied AWS Well-Architected Framework practices across Reliability, Security, Cost Optimization, Performance Efficiency, and Operational Excellence in monitoring and infrastructure design.',
      'Authored technical documentation, dashboard guides, operational runbooks, and SOPs for monitoring, alerting, and incident response, improving knowledge transfer and reducing onboarding time.',
      'Collaborated with cross-functional DevOps, SRE, and application teams to implement monitoring standards and support incident management through faster root cause analysis and reduced MTTD.',
    ],
  },
];

// Section 4: All 11 Technical Skill Categories
export const skillCategories = [
  {
    group: 'Languages',
    items: ['Python', 'Java', 'Bash', 'Shell Scripting'],
  },
  {
    group: 'AWS Compute & Storage',
    items: [
      'EC2',
      'S3',
      'Lambda',
      'RDS',
      'ECR',
      'EKS',
      'Auto Scaling',
      'SNS',
      'CloudWatch',
    ],
  },
  {
    group: 'AWS Networking',
    items: [
      'VPC',
      'Subnets',
      'Route 53',
      'ALB/NLB/CLB',
      'NAT Gateway',
      'Internet Gateway',
      'VPC Peering',
      'CloudFront',
      'Direct Connect',
    ],
  },
  {
    group: 'AWS Security',
    items: [
      'IAM',
      'KMS',
      'Secrets Manager',
      'Security Groups',
      'NACLs',
      'WAF',
      'Shield',
      'GuardDuty',
      'Security Hub',
      'ACM',
      'AWS Config',
      'CloudTrail',
    ],
  },
  {
    group: 'Containers & Orchestration',
    items: ['Docker', 'Kubernetes', 'Amazon EKS', 'Helm'],
  },
  {
    group: 'Infrastructure as Code',
    items: ['Terraform', 'AWS CloudFormation', 'Ansible'],
  },
  {
    group: 'Monitoring & Observability',
    items: [
      'CloudWatch',
      'Prometheus',
      'Grafana',
      'Dynatrace',
      'Node Exporter',
      'Alertmanager',
      'PromQL',
    ],
  },
  {
    group: 'CI/CD & Version Control',
    items: [
      'Git',
      'GitHub',
      'GitLab',
      'Jenkins',
      'GitHub Actions',
      'AWS CodePipeline',
    ],
  },
  {
    group: 'Databases',
    items: ['MySQL', 'PostgreSQL'],
  },
  {
    group: 'Operating Systems',
    items: ['Linux', 'Ubuntu', 'Amazon Linux'],
  },
  {
    group: 'Methodologies',
    items: [
      'DevOps',
      'IaC',
      'GitOps',
      'CI/CD Automation',
      'SRE',
      'Cloud Security',
      'Disaster Recovery & Backup',
      'AWS Well-Architected Framework',
      'Technical Documentation & Runbooks',
    ],
  },
];

// Readable selection from the 11 categories for the animated horizontal toolkit marquee
export const toolkit = [
  'AWS Cloud',
  'Terraform',
  'Amazon EKS',
  'Kubernetes',
  'Docker',
  'Helm',
  'Prometheus',
  'Grafana',
  'PromQL',
  'Alertmanager',
  'Node Exporter',
  'Jenkins',
  'GitHub Actions',
  'CloudWatch',
  'Dynatrace',
  'Ansible',
  'Python',
  'Bash & Linux',
];

// Section 8: All Nine Supplied Certifications
export const certifications: Certification[] = [
  {
    index: '01',
    name: 'AWS Certified CloudOps Engineer - Associate',
    code: 'SOA-C02',
    issuer: 'Amazon',
    issued: 'August 2026',
    expires: 'August 2029',
    skills: [
      'AWS Cloud Operations & Monitoring',
      'High Availability & Provisioning',
      'Deployment & Automation',
    ],
    description:
      'Deploying, managing, monitoring, and operating scalable, highly available, and fault-tolerant systems on AWS.',
  },
  {
    index: '02',
    name: 'AWS Certified Solutions Architect - Associate',
    code: 'SAA-C03',
    issuer: 'Amazon',
    issued: 'July 2026',
    expires: 'July 2029',
    skills: [
      'Solution Architecture',
      'Amazon VPC & Networking',
      'High Availability & Resilience',
      'Cost Optimization',
    ],
    description:
      'Designing secure, resilient, high-performing, and cost-optimized AWS architectures.',
  },
  {
    index: '03',
    name: 'Microsoft Certified: Azure Solutions Architect Expert',
    code: 'AZ-305',
    issuer: 'Microsoft',
    issued: 'July 2026',
    expires: 'July 2027',
    skills: [
      'Azure Infrastructure Design',
      'Azure Identity & Security (Microsoft Entra ID, RBAC, Key Vault)',
      'Azure Compute & Networking',
    ],
    description:
      'Designing secure, scalable, reliable Azure solutions across compute, networking, storage, and identity.',
  },
  {
    index: '04',
    name: 'Microsoft Certified: Azure Administrator Associate',
    code: 'AZ-104',
    issuer: 'Microsoft',
    issued: 'May 2026',
    expires: 'May 2027',
    skills: [
      'Azure Infrastructure as a Service',
      'Identity and Access Management',
      'Virtual Networks & Governance',
    ],
    description:
      'Implementing, managing, and monitoring identity, governance, storage, compute, and virtual networks in Azure.',
  },
  {
    index: '05',
    name: 'Microsoft Certified: Azure Fundamentals',
    code: 'AZ-900',
    issuer: 'Microsoft',
    issued: 'February 2026',
    // Expiry not supplied; omitted per specification
    skills: [
      'Microsoft Azure',
      'Cloud Computing Concepts',
      'Core Architecture Services',
      'Security & Compliance',
    ],
    description:
      'Foundational cloud-computing knowledge and Azure architecture, workloads, and security.',
  },
  {
    index: '06',
    name: 'GitHub Foundations',
    code: 'GH-FOUND',
    issuer: 'Microsoft / GitHub',
    issued: 'August 2026',
    expires: 'August 2028',
    skills: [
      'Git Version Control',
      'GitHub Repository Management',
      'Branching & Merging',
      'Pull Requests & CI/CD',
    ],
    description:
      'Foundational Git and GitHub knowledge, including version control, repository management, branching, merging, and collaboration.',
  },
  {
    index: '07',
    name: 'Claude Certified Architect - Foundations',
    code: 'CCA-FOUNDATIONS',
    issuer: 'Anthropic',
    issued: 'August 2026',
    expires: 'August 2027',
    skills: [
      'Claude API & Application Development',
      'Prompt Engineering & Context Management',
      'AI Agents & Tool Use',
      'Model Context Protocol',
    ],
    description:
      'Claude API application development, prompt engineering, context management, agents, tool use, and MCP.',
  },
  {
    index: '08',
    name: 'Claude Certified Developer - Foundations',
    code: 'CCD-FOUNDATIONS',
    issuer: 'Anthropic',
    issued: 'August 2026',
    expires: 'August 2027',
    skills: [
      'Claude AI / Anthropic Claude',
      'AI Application Development',
      'LLM Integration & Prompt Design',
    ],
    description:
      'Foundational knowledge of building and working with AI-powered applications using Anthropic Claude.',
  },
  {
    index: '09',
    name: 'Claude Certified Associate - Foundations',
    code: 'CCA-ASSOC',
    issuer: 'Anthropic',
    issued: 'August 2026',
    expires: 'August 2027',
    skills: [
      'Claude AI',
      'Generative AI',
      'AI Safety & Responsible Usage',
      'Context Optimization',
    ],
    description:
      'Foundational proficiency in using Claude and generative AI effectively, safely, and responsibly.',
  },
];

// Section 9: Education
export const education = [
  {
    degree: 'B.Sc. Computer Science',
    institution: 'Sri Aditya Degree College',
    university: 'Ambedkar University',
    location: 'Srikakulam, Andhra Pradesh',
    dates: 'June 2020 – August 2023',
    percentage: '77.40%',
  },
];

// Section 10: Source-Provided Portfolio Statements & Footer Copy
export const portfolioStatements = {
  contactHeading: 'Let’s build reliable cloud infrastructure.',
  supportingMessage: 'Open to Cloud / DevOps opportunities.',
  vortexPhrase: 'SAIVINOD KOTIPALLI / AWS DEVOPS ENGINEER / ',
  pillars: [
    {
      title: 'Architecting Tomorrow',
      text: 'The best way to predict the future is to engineer it with precision and resilience.',
    },
    {
      title: 'Limitless Scalability',
      text: 'Driven by curiosity, building high-availability cloud platforms for the next generation.',
    },
    {
      title: 'Continuous Evolution',
      text: 'Always learning, automating, and deploying solutions that empower tomorrow.',
    },
  ],
  taglines: [
    'Architecting the Cloud of Tomorrow',
    'Turning bold visions into resilient, automated systems.',
    'Engineered for scale · Built for the future',
  ],
  closingLine: 'The future belongs to those who build with purpose.',
};
