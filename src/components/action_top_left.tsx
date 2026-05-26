import { useEditorStore } from '@/store/editor_store'
import { Button } from '@/components/ui/button'
import { FolderDown } from 'lucide-react'


export function ActionTopLeft() {
	const setProjectModalOpen = useEditorStore((state) => state.setProjectModalOpen);

	const handleOpenImport = () => {
		setProjectModalOpen(true);
	}

	return (
		<div className='absolute top-2 left-2 gap-2 flex'>
			<Button variant='outline' size='icon' onClick={handleOpenImport}>
				<FolderDown />
			</Button>
		</div>
	)
}