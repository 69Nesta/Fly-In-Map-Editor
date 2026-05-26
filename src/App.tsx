import { CurrentSelectedElement } from '@/components/editor/overlay/current_selected_element';
import { ActionTopLeft } from '@/components/action_top_left';
import { ProjectModal } from '@/components/project_modal';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { EditorCanvas } from '@/components/editor';
import { ToolBar } from '@/components/editor/overlay/tool_bar';
import { useNetworkStore } from './store/network_store';
import { MapLoader } from './context/map_loader';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '@/components/ui/resizable'
import { RightPanel } from './components/right_panel/right_panel';


const map: MapLoader = new MapLoader([
	'# Easy Level 2: Simple fork with two paths',
	'nb_drones: 4',
	'',
	'start_hub: start -0 0 [color=green]',
	'hub: junction 1 0 [color=yellow max_drones=2]',
	'hub: path_a 2 1 [color=blue]',
	'hub: path_b 2 -1 [color=blue]',
	'end_hub: goal 3 0 [color=red max_drones=3]',
	'',
	'connection: start-junction [max_link_capacity=2]',
	'connection: junction-path_a',
	'connection: junction-path_b',
	'connection: path_a-goal',
	'connection: path_b-goal'
]);


const App = () => {
	const network = useNetworkStore();
	const editorBoxRef: RefObject<HTMLDivElement | null> = useRef(null);
	const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);

	useEffect(() => {
		network.import(map.data);
	}, []);

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
