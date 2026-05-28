import { CurrentSelectedElement } from '~/components/editor/overlay/current_selected_element';
import { ActionTopLeft } from '~/components/action_top_left';
import { ProjectModal } from '~/components/project_modal';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { EditorCanvas } from '~/components/editor';
import { ToolBar } from '~/components/editor/overlay/tool_bar';
import { Button } from '~/components/ui/button';
import { PanelRightOpen } from 'lucide-react';
import { MapLoader } from '~/context/map_loader';
import { useEditorStore } from '~/store/editor_store';
import { useNetworkStore } from '~/store/network_store';

import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from '~/components/ui/resizable'
import { RightPanel } from '~/components/right_panel/right_panel';
import { useAutosave } from '~/hooks/use_autosave';
import type { InertiaProps } from '~/types';
import { ProjectSummary } from '~/types/project_summary';
import { ActionBottomLeft } from '~/components/action_bottom_left';

type HomeProps = InertiaProps<{
	project?: ProjectSummary | null;
	projects?: ProjectSummary[];
	readOnly?: boolean;
	canImport?: boolean;
}>

export default function Home(props: HomeProps) {
	const project = props.project ?? null;
	const canImport = props.canImport ?? false;
	const readOnly = props.readOnly ?? false;
	const editorBoxRef: RefObject<HTMLDivElement | null> = useRef(null);
	const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
	const setReadOnly = useEditorStore((s) => s.setReadOnly);
	const isReadOnly = useEditorStore((s) => s.readOnly);

	useEffect(() => {
		if (readOnly)
			setReadOnly(true);
	}, [readOnly, setReadOnly])

	const setCurrentProjectName = useEditorStore((state) => state.setCurrentProjectName);

	const import_map = useNetworkStore((state) => state.import);
	const clear_map = useNetworkStore((state) => state.clear);

	const { forceSave, isSaving } = useAutosave({ project, enabled: !isReadOnly });

	useEffect(() => {
		if (!project?.content)
		{
			clear_map();
			setCurrentProjectName(null);
			return;
		}

		setCurrentProjectName(project.name);
		const mapLoader = new MapLoader(project.content.split('\n'));
		import_map(mapLoader.data);
	}, [import_map, project?.content, project?.id,project?.name, setCurrentProjectName]);

	return (
		<div className='flex w-screen h-screen'>
			<ResizablePanelGroup orientation='horizontal'>
				<ResizablePanel>
					<div ref={editorBoxRef} className={'relative w-full h-full'}>
						<EditorCanvas parent={editorBoxRef} />

						<CurrentSelectedElement />
						<ActionTopLeft canImport={canImport} />
						<ActionBottomLeft onForceSave={forceSave} isSaving={isSaving} canForceSave={Boolean(project)}/>
						<ToolBar />
						{!isReadOnly ? <ProjectModal /> : null}
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

import EmptyLayout from '~/layouts/empty';
import { ReactElement } from 'react';

Home.layout = function (page: ReactElement<HomeProps>) {
	return <EmptyLayout>{page}</EmptyLayout>
}
