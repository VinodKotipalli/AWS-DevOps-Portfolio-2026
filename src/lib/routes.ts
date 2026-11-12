export const workIds = [
  'aws-multi-tier',
  'amazon-eks',
  'github-actions-cicd',
] as const;

export const toolIds = [
  'terraform-remote-state',
  'aws-observability',
] as const;

export const projectIds = [...workIds, ...toolIds] as const;

export type ProjectId = (typeof projectIds)[number];

export type Route =
  | { page: 'home'; anchor?: string }
  | { page: 'work' }
  | { page: 'tools' }
  | { page: 'about' }
  | { page: 'resume' }
  | { page: 'project'; id: ProjectId };

const projectPattern = new RegExp(
  `^(?:work/(${workIds.join('|')})|tools/(${toolIds.join('|')})|work/(${toolIds.join('|')})|projects/(${projectIds.join('|')}))$`
);

const homeAnchors = new Set([
  'my-story',
  'my-approach',
  'selected-work',
  'projects',
  'secondary-projects',
  'experience',
  'skills',
  'certifications',
  'beyond-work',
  'contact',
]);

export function projectSection(id: ProjectId): 'work' | 'tools' {
  return (toolIds as readonly string[]).includes(id) ? 'tools' : 'work';
}

export function projectHash(id: ProjectId) {
  return `#${projectSection(id)}/${id}`;
}

export function parseRoute(hash: string): Route {
  const value = hash.startsWith('#') ? hash.slice(1) : hash;
  if (value === 'work' || value === 'tools' || value === 'about' || value === 'resume') {
    return { page: value };
  }
  const project = projectPattern.exec(value);
  if (project) {
    const id = (project[1] ?? project[2] ?? project[3] ?? project[4]) as ProjectId;
    return { page: 'project', id };
  }
  if (homeAnchors.has(value)) {
    const normalizedAnchor = value === 'projects' ? 'selected-work' : value;
    return { page: 'home', anchor: normalizedAnchor };
  }
  return { page: 'home' };
}

export function routeKey(route: Route) {
  return route.page === 'project' ? `project:${route.id}` : route.page;
}

export function routeTitle(route: Route, names: Record<string, string> = {}) {
  if (route.page === 'project') return names[route.id] || 'Case Study';
  return {
    home: 'Saivinod Kotipalli',
    work: 'Projects',
    tools: 'Infrastructure & Observability',
    about: 'About & Skills',
    resume: 'Resume & Credentials',
  }[route.page];
}
