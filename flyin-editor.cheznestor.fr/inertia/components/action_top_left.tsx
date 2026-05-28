import { Link, router, usePage } from '@inertiajs/react'
import { Home, LogIn, Rocket } from 'lucide-react'

import { useEditorStore } from '~/store/editor_store'
import { ProjectSummary } from '~/types/project_summary'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'

type ActionTopLeftProps = {
	canImport?: boolean;
};

type PageProps = {
	project?: ProjectSummary | null;
	user?: { id: string } | null;
};

export function ActionTopLeft({ canImport = false }: ActionTopLeftProps) {
	const page = usePage<PageProps>();
	const setProjectModalOpen = useEditorStore((state) => state.setProjectModalOpen)
	const currentProjectName = useEditorStore((state) => state.currentProjectName)
	const setCurrentProjectName = useEditorStore((state) => state.setCurrentProjectName)
	const readOnly = useEditorStore((state) => state.readOnly);

	const project = page.props.project ?? null
	const isConnected = Boolean(page.props.user)
	const projectName = currentProjectName ?? project?.name ?? 'Unsaved Project'

	const handleOpenImport = () => {
		if (readOnly)
			return

		setProjectModalOpen(true)
	}

	const handleImportToEdit = () => {
		if (!project || !canImport)
			return

		if (!isConnected) {
			router.visit('/login')
			return
		}

		router.post('/projects', {
			name: project.name,
			description: project.description,
			visibility: 'private',
			content: project.content,
		}, {
			onSuccess: (response) => {
				const newProject = response.props.project as ProjectSummary;
				setCurrentProjectName(newProject.name);
			},
			preserveScroll: true,
		})
	}

	const handleOpenProject = () => {
		if (readOnly)
			return

		handleOpenImport()
	}

	return (
		<div className='absolute top-2 left-2 z-20 max-w-[calc(100vw-1rem)] rounded-2xl border border-border/70 bg-background/80 px-3 py-2 shadow-lg backdrop-blur-md'>
			<Breadcrumb>
				<BreadcrumbList className='flex-nowrap gap-1.5 overflow-hidden'>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href='/' aria-label='Home'>
								<Home className='size-4' />
							</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					{readOnly ? (
						<>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href='/workshop'>Workshop</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{isConnected ? (
									<BreadcrumbLink asChild>
										<button
											type='button'
											onClick={handleImportToEdit}
											disabled={!canImport}
											className='inline-flex items-center gap-1.5'
										>
											<Rocket className='size-4' />
											<span>Import to edit</span>
										</button>
									</BreadcrumbLink>
								) : (
									<BreadcrumbLink asChild>
										<Link href='/login'>
											<LogIn className='size-4' />
											<span>Login</span>
										</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage className='max-w-40 truncate'>{project?.name ?? 'Project Name'}</BreadcrumbPage>
							</BreadcrumbItem>
						</>
					) : (
						<>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<button
										type='button'
										onClick={handleOpenProject}
										className='inline-flex items-center gap-1.5'
									>
										<span>My Project</span>
									</button>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage className='max-w-40 truncate'>{projectName}</BreadcrumbPage>
							</BreadcrumbItem>
						</>
					)}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	)
}