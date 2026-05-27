import { useEditorStore } from '~/store/editor_store'
import { Button } from '~/components/ui/button'
import { FolderDown, Loader2, Save } from 'lucide-react'

type ActionTopLeftProps = {
	onForceSave: () => void;
	isSaving: boolean;
	canForceSave: boolean;
};

export function ActionTopLeft({ onForceSave, isSaving, canForceSave }: ActionTopLeftProps) {
	const setProjectModalOpen = useEditorStore((state) => state.setProjectModalOpen);

	const handleOpenImport = () => {
		setProjectModalOpen(true);
	}

	return (
		<div className='absolute top-2 left-2 flex flex-col gap-2'>
			<Button variant='outline' size='icon' onClick={handleOpenImport}>
				<FolderDown />
			</Button>
			{canForceSave ? (
				<Button variant='outline' size='icon' onClick={onForceSave} disabled={isSaving} aria-label='Force save'>
					{isSaving ? <Loader2 className='animate-spin' /> : <Save />}
				</Button>
			) : null}
		</div>
	)
}