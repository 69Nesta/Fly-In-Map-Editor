import { Link, usePage } from '@inertiajs/react';
import { IconFolderCode, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

import { Button } from '~/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '~/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Textarea } from '~/components/ui/textarea';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table';
import { MapLoader } from '~/context/map_loader';
import { useEditorStore } from '~/store/editor_store';
import { useNetworkStore } from '~/store/network_store';
import { ProjectSummary, ProjectVisibility } from '~/types/project_summary';
import { Pen } from 'lucide-react';

type PageProps = {
	user?: {
		id: string;
		login?: string | null;
		avatarUrl?: string | null;
	} | null;
	project?: ProjectSummary | null;
	projects?: ProjectSummary[];
};

type GuestDraft = {
	name: string;
	description: string;
	visibility: ProjectVisibility;
	map: string;
};

type EditingProject = {
	id: string;
	name: string;
	description: string | null;
	visibility: ProjectVisibility;
} | null;

const guestDraftStorageKey = 'flyin-editor:guest-project-draft';

const defaultDraft: GuestDraft = {
	name: '',
	description: '',
	visibility: 'private',
	map: '',
};

const buildStarterContent = () => [
	'nb_drones: 1',
	'',
	'start_hub: start -1 0 [max_drones=1 color=red]',
	'end_hub: end 1 0 [max_drones=1 color=cyan]',
	'connection: start-end',
	'',
].join('\n')

export function ProjectModal() {
	const page = usePage<PageProps>();
	const user = page.props.user ?? null;
	const project: ProjectSummary | null = page.props.project ?? null;
	const projects: ProjectSummary[] = page.props.projects ?? [];
	const isConnected = Boolean(user);

	const projectModalOpen = useEditorStore((state) => state.projectModalOpen);
	const setProjectModalOpen = useEditorStore((state) => state.setProjectModalOpen);
	const setCurrentProjectName = useEditorStore((state) => state.setCurrentProjectName);
	const network = useNetworkStore();

	const importRef: RefObject<HTMLTextAreaElement | null> = useRef<HTMLTextAreaElement | null>(null);
	const [activeTab, setActiveTab] = useState<'open' | 'create' | 'import'>('open');
	const [guestDraft, setGuestDraft] = useState<GuestDraft>(defaultDraft);
	const [isGuestMode, setIsGuestMode] = useState(false);
	const [editingProject, setEditingProject] = useState<EditingProject>(null);
	const [deleteConfirmProject, setDeleteConfirmProject] = useState<ProjectSummary | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const close = () => setProjectModalOpen(false);

	useEffect(() => {
		if (!project?.content)
			return;
		console.log('Loading project content into the editor');
		console.log(project.content);
		setCurrentProjectName(project.name);

		const lines: string[] = project.content.split('\n');
		const mapLoader = new MapLoader(lines);

		network.import(mapLoader.data);
		setProjectModalOpen(false);
	}, []);

	useEffect(() => {
		if (typeof window === 'undefined')
			return;

		const storedDraft = window.localStorage.getItem(guestDraftStorageKey);
		if (!storedDraft)
			return;

		try {
			const parsedDraft = JSON.parse(storedDraft) as Partial<GuestDraft>;
			setGuestDraft({
				name: parsedDraft.name ?? '',
				description: parsedDraft.description ?? '',
				visibility: parsedDraft.visibility === 'public' ? 'public' : 'private',
				map: parsedDraft.map ?? '',
			});
			setIsGuestMode(true);
			setActiveTab('create');
		} catch {
			window.localStorage.removeItem(guestDraftStorageKey);
		}
	}, []);

	const persistGuestDraft = (nextDraft: GuestDraft) => {
		setGuestDraft(nextDraft);

		if (typeof window === 'undefined' || isConnected && !isGuestMode)
			return;

		window.localStorage.setItem(guestDraftStorageKey, JSON.stringify(nextDraft));
	};

	const clearGuestDraft = () => {
		setGuestDraft(defaultDraft);

		if (typeof window === 'undefined')
			return;

		window.localStorage.removeItem(guestDraftStorageKey);
	};

	const handleContinueAsGuest = () => {
		setIsGuestMode(true);
		setActiveTab('create');
	};

	const handleCreateProject = () => {
		router.post('/projects', {
			name: guestDraft.name.trim() || 'New project',
			description: guestDraft.description.trim() || null,
			visibility: guestDraft.visibility,
			content: buildStarterContent(),
		}, {
			preserveScroll: true,
			onSuccess: () => {
				setCurrentProjectName(guestDraft.name.trim() || 'New project');
				clearGuestDraft();
				close();
			},
		});
	};

	const handleImportProject = () => {
		const content = importRef.current?.value ?? guestDraft.map;
		router.post('/projects', {
			name: guestDraft.name.trim() || 'Imported map',
			description: guestDraft.description.trim() || null,
			visibility: guestDraft.visibility,
			content,
		}, {
			preserveScroll: true,
			onSuccess: () => {
				clearGuestDraft();
				close();
			},
		});
	};

	const handleOpenProject = (project: ProjectSummary) => {
		if (!project.id)
			return;

		clearGuestDraft();
		router.visit(`/projects/${project.id}`);
	};

	const handleEditProject = (project: ProjectSummary) => {
		setEditingProject({
			id: project.id,
			name: project.name,
			description: project.description ?? null,
			visibility: project.visibility ?? 'private',
		});
	};

	const handleSaveProject = () => {
		if (!editingProject) return;

		setIsSaving(true);
		router.patch(
			`/projects/${editingProject.id}`,
			{
				name: editingProject.name.trim() || 'Untitled',
				description: editingProject.description?.trim() || null,
				visibility: editingProject.visibility,
				content: null,
			},
			{
				preserveScroll: true,
				onSuccess: () => {
					setEditingProject(null);
					setIsSaving(false);
				},
				onError: () => {
					setIsSaving(false);
				},
			}
		);
	};

	const handleDeleteProject = (project: ProjectSummary) => {
		setDeleteConfirmProject(project);
	};

	const handleConfirmDelete = () => {
		if (!deleteConfirmProject?.id) return;

		setIsDeleting(true);
		router.delete(`/projects/${deleteConfirmProject.id}`, {
			preserveScroll: true,
			onSuccess: () => {
				setDeleteConfirmProject(null);
				setIsDeleting(false);
			},
			onError: () => {
				setIsDeleting(false);
			},
		});
	};

	const projectCountLabel = useMemo(() => {
		if (!isConnected)
			return 'Guest draft mode';

		return projects.length === 1 ? '1 project available' : `${projects.length} projects available`;
	}, [isConnected, projects.length]);

	return (
		<>
			<Dialog open={projectModalOpen && !project} onOpenChange={(open) => setProjectModalOpen(Boolean(open))}>
				<DialogContent className='sm:max-w-4xl'>
				<DialogHeader className='space-y-3'>
					<div className='flex items-start justify-between gap-4'>
						<div className='space-y-1'>
							<DialogTitle className='flex items-center gap-2'>
								<IconFolderCode className='size-5' />
								Start a project
							</DialogTitle>
							<DialogDescription>
								Open an existing project, create a new one, or import a map into the editor.
							</DialogDescription>
						</div>
					</div>
					<p className='text-sm text-muted-foreground'>{projectCountLabel}</p>
				</DialogHeader>

				{isConnected ? (
					<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'open' | 'create' | 'import')} className='mt-2'>
						<TabsList className='grid w-full grid-cols-3'>
							<TabsTrigger value='open'>Open</TabsTrigger>
							<TabsTrigger value='create'>Create</TabsTrigger>
							<TabsTrigger value='import'>Import</TabsTrigger>
						</TabsList>

						<TabsContent value='open' className='mt-4 space-y-4'>
							{projects.length > 0 ? (
							<div className='rounded-md border'>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Name</TableHead>
											<TableHead className='w-48'>Description</TableHead>
											<TableHead className='w-20'>Visibility</TableHead>
											<TableHead className='w-40'>Updated</TableHead>
											<TableHead className='w-16 text-center'>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{projects.map((proj) => (
											<TableRow key={proj.id}>
												<TableCell className='font-medium'>{proj.name}</TableCell>
												<TableCell className='max-w-48 truncate text-sm text-muted-foreground'>
													{proj.description || 'No description'}
												</TableCell>
												<TableCell className='text-sm capitalize'>
													{proj.visibility ?? 'private'}
												</TableCell>
												<TableCell className='text-sm text-muted-foreground'>
													{proj.updatedAt ? new Date(proj.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
												</TableCell>
												<TableCell className='text-right gap-2 flex'>
													<Button variant={'outline'} onClick={() => handleOpenProject(proj)}>
														Open
													</Button>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant='outline'>
																<Pen className='size-4' />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align='end'>
															<DropdownMenuItem onClick={() => handleOpenProject(proj)}>
																Open
															</DropdownMenuItem>
															<DropdownMenuItem onClick={() => handleEditProject(proj)}>
																<IconEdit className='mr-2 size-4' />
																Edit
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => handleDeleteProject(proj)}
																className='text-destructive'
															>
																<IconTrash className='mr-2 size-4' />
																Delete
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						) : (
							<Card className='border-dashed'>
								<CardHeader>
									<CardTitle>No projects yet</CardTitle>
									<CardDescription>
										Create your first project or import an existing map to get started.
									</CardDescription>
								</CardHeader>
								<CardContent className='flex flex-wrap gap-2'>
									<Button onClick={() => setActiveTab('create')}>Create project</Button>
									<Button variant='outline' onClick={() => setActiveTab('import')}>Import map</Button>
								</CardContent>
							</Card>
						)}
					</TabsContent>

						<TabsContent value='create' className='mt-4 space-y-4'>
							<Card>
								<CardHeader>
									<CardTitle>New project</CardTitle>
									<CardDescription>
										Set the project details before you start editing.
									</CardDescription>
								</CardHeader>
								<CardContent className='grid gap-4'>
									<div className='grid gap-2'>
										<Label htmlFor='project-name'>Name</Label>
										<Input
											id='project-name'
											placeholder='Urban delivery map'
											value={guestDraft.name}
											onChange={(event) => persistGuestDraft({ ...guestDraft, name: event.target.value })}
										/>
									</div>
									<div className='grid gap-2'>
										<Label htmlFor='project-description'>Description</Label>
										<Textarea
											id='project-description'
											placeholder='Short project summary'
											value={guestDraft.description}
											onChange={(event) => persistGuestDraft({ ...guestDraft, description: event.target.value })}
										/>
									</div>
									<div className='grid gap-2'>
										<Label>Visibility</Label>
										<Select
											value={guestDraft.visibility}
											onValueChange={(value) => persistGuestDraft({ ...guestDraft, visibility: value as ProjectVisibility })}
										>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Choose visibility' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='private'>Private</SelectItem>
												<SelectItem value='public'>Public</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value='import' className='mt-4 space-y-4'>
							<Card>
								<CardHeader>
									<CardTitle>Import map</CardTitle>
									<CardDescription>
										Paste the map text here. The current parser stays the same.
									</CardDescription>
								</CardHeader>
								<CardContent className='grid gap-2'>
									<Label htmlFor='import-map'>Map content</Label>
									<Textarea
										id='import-map'
										ref={importRef}
										className='min-h-56 font-mono text-xs'
										placeholder={'nb_drones: 2\nstart_hub: start 0 0 [max_drones=2]\n...'}
										value={guestDraft.map}
										onChange={(event) => persistGuestDraft({ ...guestDraft, map: event.target.value })}
									/>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				) : (
					<Card className='mt-2 border-border/70'>
						<CardHeader>
							<CardTitle>Sign in to save projects</CardTitle>
							<CardDescription>
								You can continue as a guest, but the map will stay local until you export it.
							</CardDescription>
						</CardHeader>
						<CardContent className='grid gap-4'>
							<div className='flex flex-wrap gap-2'>
								<Button asChild>
									<Link href='/login'>Login with intra</Link>
								</Button>
								<Button variant='outline' autoFocus={false} onClick={handleContinueAsGuest}>
									Continue as guest
								</Button>
							</div>
							<Separator />
							<div className='grid gap-2'>
								<Label htmlFor='guest-map'>Import a local draft</Label>
								<Textarea
									id='guest-map'
									ref={importRef}
									className='min-h-56 font-mono text-xs'
									placeholder={'Paste a previously exported map here'}
									value={guestDraft.map}
									onChange={(event) => persistGuestDraft({ ...guestDraft, map: event.target.value })}
								/>
							</div>
						</CardContent>
					</Card>
				)}

				<DialogFooter className='gap-2'>
					<Button variant='outline' onClick={close}>
						Cancel
					</Button>
					{isConnected ? (
						<>
							{activeTab === 'open' ? (
								<Button variant='default' onClick={() => setActiveTab('create')}>Create new project</Button>
							) : null}
							{activeTab === 'create' ? <Button onClick={handleCreateProject}>Start editing</Button> : null}
							{activeTab === 'import' ? <Button onClick={handleImportProject}>Import and edit</Button> : null}
						</>
					) : (
						<Button asChild>
							<Link href='/login'>Login with intra</Link>
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>

		{/* Edit Project Dialog */}
		<Dialog open={editingProject !== null} onOpenChange={(open) => !open && setEditingProject(null)}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit project</DialogTitle>
					<DialogDescription>
						Update your project details.
					</DialogDescription>
				</DialogHeader>
				{editingProject && (
					<div className='grid gap-4'>
						<div className='grid gap-2'>
							<Label htmlFor='edit-project-name'>Name</Label>
							<Input
								id='edit-project-name'
								value={editingProject.name}
								onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
								placeholder='Project name'
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='edit-project-description'>Description</Label>
							<Textarea
								id='edit-project-description'
								value={editingProject.description || ''}
								onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value || null })}
								placeholder='Project description'
								className='min-h-24'
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='edit-project-visibility'>Visibility</Label>
							<Select
								value={editingProject.visibility}
								onValueChange={(value) => setEditingProject({ ...editingProject, visibility: value as ProjectVisibility })}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='private'>Private</SelectItem>
									<SelectItem value='public'>Public</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				)}
				<DialogFooter>
					<Button variant='outline' onClick={() => setEditingProject(null)}>Cancel</Button>
					<Button onClick={handleSaveProject} disabled={isSaving}>
						{isSaving ? 'Saving...' : 'Save'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>

		{/* Delete Confirmation Dialog */}
		<Dialog open={deleteConfirmProject !== null} onOpenChange={(open) => !open && setDeleteConfirmProject(null)}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Delete project</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete "{deleteConfirmProject?.name}"? This action cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant='outline' onClick={() => setDeleteConfirmProject(null)}>Cancel</Button>
					<Button variant='destructive' onClick={handleConfirmDelete} disabled={isDeleting}>
						{isDeleting ? 'Deleting...' : 'Delete'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
		</>
	);
}