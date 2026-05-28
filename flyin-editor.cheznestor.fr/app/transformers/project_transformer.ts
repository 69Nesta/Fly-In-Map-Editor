import type Project from '#models/project'

type ProjectSummary = {
	id: string;
	userId: string;
	ownerLogin: string | null;
	name: string;
	description: string | null;
	content: string;
	visibility: 'private' | 'public';
	thumbnailUrl: string | null;
	createdAt: string | null;
	updatedAt: string | null;
}

export function transformProject(project: Project): ProjectSummary {
	return {
		id: project.id,
		userId: project.userId,
		ownerLogin: project.user?.login ?? null,
		name: project.name,
		description: project.description,
		content: project.content,
		visibility: project.visibility,
		thumbnailUrl: project.thumbnailUrl,
		createdAt: project.createdAt.toISO(),
		updatedAt: project.updatedAt ? project.updatedAt.toISO() : null,
	}
}

export function transformProjects(projects: Project[]) {
	return projects.map(transformProject)
}