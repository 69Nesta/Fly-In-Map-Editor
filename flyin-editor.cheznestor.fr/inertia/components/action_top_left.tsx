import { useEditorStore } from '~/store/editor_store'
import { Button } from '~/components/ui/button'
import { Home, LogIn, Rocket } from 'lucide-react'
import { router, usePage } from '@inertiajs/react'
import { ProjectSummary } from '~/types/project_summary';

type ActionTopLeftProps = {
	canImport?: boolean;
};

type PageProps = {
	project?: {
		id: string;
		name: string;
		description: string | null;
		visibility: 'private' | 'public';
		content: string;
	} | null;
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

	const label = currentProjectName || (readOnly ? 'Workshop preview' : 'Projects')

	return (
		<div className='absolute top-2 left-2 z-20 flex items-center gap-2 rounded-2xl border border-border/70 bg-background/80 p-1.5 shadow-lg backdrop-blur-md'>
			<Button
				variant='outline'
				size='default'
				className='gap-2 rounded-xl px-3'
				onClick={readOnly ? handleImportToEdit : handleOpenImport}
				aria-label={readOnly ? 'Import workshop map' : 'Open project modal'}
				disabled={readOnly && !canImport && isConnected}
			>
				{readOnly ? (isConnected ? <Rocket /> : <LogIn />) : <Home />}
				<span className='max-w-40 text-gray-500 truncate'>&gt;</span>
				<span className='max-w-40 truncate'>{readOnly ? (isConnected ? 'Import to edit' : 'Sign in to import') : label}</span>
			</Button>
		</div>
	)
}