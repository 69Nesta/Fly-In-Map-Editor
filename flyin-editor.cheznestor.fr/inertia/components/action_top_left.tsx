import { useEditorStore } from '~/store/editor_store'
import { Button } from '~/components/ui/button'
import { Home, Loader2, Save } from 'lucide-react'

type ActionTopLeftProps = {
	onForceSave: () => void;
	isSaving: boolean;
	canForceSave: boolean;
	projectName?: string | null;
};

export function ActionTopLeft({ onForceSave, isSaving, canForceSave, projectName }: ActionTopLeftProps) {
	const setProjectModalOpen = useEditorStore((state) => state.setProjectModalOpen)
	const currentProjectName = useEditorStore((state) => state.currentProjectName)

	const handleOpenImport = () => {
		setProjectModalOpen(true)
	}

	const label = currentProjectName || 'Projects'

	return (
		<div className='absolute top-2 left-2 z-20 flex items-center gap-2 rounded-2xl border border-border/70 bg-background/80 p-1.5 shadow-lg backdrop-blur-md'>
			<Button variant='outline' size='default' className='gap-2 rounded-xl px-3' onClick={handleOpenImport} aria-label='Open project modal'>
				<Home />
				<span className='max-w-40 text-gray-500 truncate'>&gt;</span>
				<span className='max-w-40 truncate'>{label}</span>
			</Button>
			{canForceSave ? (
				<Button variant='outline' size='default' className='gap-2 rounded-xl px-3' onClick={onForceSave} disabled={isSaving} aria-label='Save project'>
					{isSaving ? <Loader2 className='animate-spin' /> : <Save />}
					<span>Save</span>
				</Button>
			) : null}
		</div>
	)
}