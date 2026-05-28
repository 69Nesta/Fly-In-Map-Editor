import { CurrentSelectedElement } from '~/components/editor/overlay/current_selected_element';
import { ActionTopLeft } from '~/components/action_top_left';
import { ProjectModal } from '~/components/project_modal';
import { useRef, useState, type RefObject } from 'react';
import { EditorCanvas } from '~/components/editor';
import { ToolBar } from '~/components/editor/overlay/tool_bar';
import { Button } from '~/components/ui/button';
import { PanelRightOpen } from 'lucide-react';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '~/components/ui/resizable'
import { RightPanel } from '~/components/right_panel/right_panel';
import { useAutosave } from '~/hooks/use_autosave';
import type { InertiaProps } from '~/types';
import { ProjectSummary } from '~/types/project_summary';
import { About } from '~/components/about/about';

type HomeProps = InertiaProps<{
	project?: ProjectSummary | null;
	projects?: ProjectSummary[];
}>

export default function Home(props: HomeProps) {
	const project = props.project ?? null;
	const editorBoxRef: RefObject<HTMLDivElement | null> = useRef(null);
	const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);

	const { forceSave, isSaving } = useAutosave({ project });

	return (
		<div className='flex w-screen h-screen'>
			<ResizablePanelGroup orientation='horizontal'>
				<ResizablePanel>
					<div ref={editorBoxRef} className={'relative w-full h-full'}>
						<EditorCanvas parent={editorBoxRef} />

						<CurrentSelectedElement />
						<ActionTopLeft onForceSave={forceSave} isSaving={isSaving} canForceSave={Boolean(project)} />
						<About />
						<ToolBar />
						<ProjectModal />
						{!isRightPanelVisible && (
							<Button
								variant='outline'
								className='absolute top-2 right-2 z-20'
								onClick={() => setIsRightPanelVisible(true)}
								aria-label='Show right panel'
							>
								<PanelRightOpen />
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
