import { MoveHorizontal, Pointer, CirclePlus } from 'lucide-react'
import { useEditorStore } from "~/store/editor_store";
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'


export function ToolBar() {
	const currentTool = useEditorStore((s) => s.currentTool);
	const setTool = useEditorStore((s) => s.setTool);

	return <>
		<div className='absolute bottom-2 left-0 w-full flex justify-center'>
			<Card className='px-4 py-3 flex-row gap-3'>
				<Button variant={currentTool === 'select' ? 'default' : 'outline'} onClick={() => setTool('select')} size='icon'>
					<Pointer />
				</Button>
				<Button variant={currentTool === 'connection' ? 'default' : 'outline'} onClick={() => setTool('connection')} size='icon'>
					<MoveHorizontal />
				</Button>
				<Button variant={currentTool === 'node' ? 'default' : 'outline'} onClick={() => setTool('node')} size='icon'>
					<CirclePlus />
				</Button>
			</Card>
		</div>
	</>
}
