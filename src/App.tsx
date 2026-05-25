import { CurrentSelectedElement } from '@/components/current_selected_element';
import { ActionTopRight } from '@/components/action_top_right';
import { ProjectModal } from '@/components/project_modal';
import { EditorCanvas } from '@/components/editor';
import { ToolBar } from '@/components/tool_bar';


const App = () => {
	return (
		<div className={'relative'}>
			<EditorCanvas />

			<CurrentSelectedElement />
			<ActionTopRight />
			<ToolBar />
			<ProjectModal />
		</div>
	);
};

export default App;
