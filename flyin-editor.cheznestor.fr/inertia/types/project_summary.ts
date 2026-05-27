export type ProjectVisibility = 'private' | 'public';

export type ProjectSummary = {
	id: string;
	userId: string;
	name: string;
	description: string | null;
	visibility: ProjectVisibility;
	content: string;
	thumbnailUrl: string | null;
	createdAt: string | null;
	updatedAt: string | null;
}

