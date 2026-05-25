import { CurrentSelectedElement } from '@/components/current_selected_element';
import { ActionTopRight } from '@/components/action_top_right';
import { ProjectModal } from '@/components/project_modal';
import { EditorCanvas } from '@/components/editor';
import { ToolBar } from '@/components/tool_bar';
import { useEffect } from 'react';
import { useNetworkStore } from './store/network_store';
import { MapLoader } from './context/map_loader';


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

	useEffect(() => {
		network.import(map.data);
	}, []);

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
