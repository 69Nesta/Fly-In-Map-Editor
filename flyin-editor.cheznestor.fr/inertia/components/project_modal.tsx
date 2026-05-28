import { Link, usePage } from '@inertiajs/react';
import { IconFolderCode } from '@tabler/icons-react';
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
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Textarea } from '~/components/ui/textarea';
import { MapLoader } from '~/context/map_loader';
import { useEditorStore } from '~/store/editor_store';
import { useNetworkStore } from '~/store/network_store';
import { ProjectSummary, ProjectVisibility } from '~/types/project_summary';

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

	const projectCountLabel = useMemo(() => {
		if (!isConnected)
			return 'Guest draft mode';

		return projects.length === 1 ? '1 project available' : `${projects.length} projects available`;
	}, [isConnected, projects.length]);

	return (
		<Dialog open={projectModalOpen && !project} onOpenChange={(open) => setProjectModalOpen(Boolean(open))}>
			<DialogContent className='sm:max-w-3xl'>
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
						<Separator orientation='vertical' className='hidden h-12 sm:block' />
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
								<div className='grid gap-3 sm:grid-cols-2'>
									{projects.map((project) => (
										<Card key={'card-project-' + project.id} className='border-border/70'>
											<CardHeader className='space-y-2'>
												<div className='flex items-start justify-between gap-2'>
													<CardTitle>{project.name}</CardTitle>
													<Select value={project.visibility ?? 'private'} disabled>
														<SelectTrigger className='w-28' size='sm'>
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value='private'>Private</SelectItem>
															<SelectItem value='public'>Public</SelectItem>
														</SelectContent>
													</Select>
												</div>
												<CardDescription className='line-clamp-2 min-h-10'>
													{project.description || 'No description provided.'}
												</CardDescription>
											</CardHeader>
											<CardContent className='flex items-center justify-between gap-3'>
												<p className='text-xs text-muted-foreground'>
													{project.updatedAt ? `Updated ${project.updatedAt}` : 'Ready to open'}
												</p>
												<Button variant='secondary' onClick={() => handleOpenProject(project)}>
													Open
												</Button>
											</CardContent>
										</Card>
									))}
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
									<Link href='/login'>Login or register</Link>
								</Button>
								<Button variant='outline' onClick={handleContinueAsGuest}>
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
								<Button variant='secondary' onClick={() => setActiveTab('create')}>Create new project</Button>
							) : null}
							{activeTab === 'create' ? <Button onClick={handleCreateProject}>Start editing</Button> : null}
							{activeTab === 'import' ? <Button onClick={handleImportProject}>Import and edit</Button> : null}
						</>
					) : (
						<Button onClick={handleContinueAsGuest}>Continue as guest</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}