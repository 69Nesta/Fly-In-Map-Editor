import { CurrentSelectedElement } from '@/components/editor/overlay/current_selected_element';
import { ActionTopLeft } from '@/components/action_top_left';
import { ProjectModal } from '@/components/project_modal';
import { useRef, useState, type RefObject } from 'react';
import { EditorCanvas } from '@/components/editor';
import { ToolBar } from '@/components/editor/overlay/tool_bar';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable'
import { RightPanel } from './components/right_panel/right_panel';

const App = () => {
	const editorBoxRef: RefObject<HTMLDivElement | null> = useRef(null);
	const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);

	return (
		<div className='flex w-screen h-screen'>
			<ResizablePanelGroup orientation='horizontal'>
				<ResizablePanel>
					<div ref={editorBoxRef} className={'relative w-full h-full'}>
						<EditorCanvas parent={editorBoxRef} />

						<CurrentSelectedElement />
						{/* <ActionTopRight /> */}
						<ActionTopLeft />
						<ToolBar />
						<ProjectModal />
						{!isRightPanelVisible && (
							<Button
								variant='outline'
								size='sm'
								className='absolute top-2 right-2 z-20'
								onClick={() => setIsRightPanelVisible(true)}
								aria-label='Show right panel'
							>
								<ChevronLeft />
								Show panel
							</Button>
						)}
					</div>
				</ResizablePanel>
				{isRightPanelVisible && <ResizableHandle withHandle />}
				{isRightPanelVisible && (
					<ResizablePanel defaultSize={'24%'} maxSize={'40%'} minSize={'15%'}>
						<RightPanel onHide={() => setIsRightPanelVisible(false)} />
					</ResizablePanel>
				)}
			</ResizablePanelGroup>
		</div>
	);
};

export default App;
