import { useRef, type RefObject, useEffect } from 'react'
import { Stage, Layer, Circle } from 'react-konva'
import { MapLoader } from '@/context/map_loader';
import { Node } from '@/components/node';
import Konva from 'konva'
import { Network } from './context/network';

// Pre-generate grid dots
const gridDots: { x: number; y: number }[] = [];
const spacing: number = 1;
const range: number = 10;
for (let gx = -range; gx <= range; gx += spacing) {
	for (let gy = -range; gy <= range; gy += spacing) {
		gridDots.push({ x: gx, y: gy });
	}
}


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

const network = new Network();
network.import(map.data);

console.log(network.export().join('\n'));


const App = () => {
	const stageRef: RefObject<Konva.Stage | null> = useRef<Konva.Stage | null>(null);
	const screenSize: RefObject<{ width: number, height: number }> = useRef({ width: window.innerWidth, height: window.innerHeight });
	const scaleBy: number = 1.05;


    useEffect(() => {
		const handleResize = () => {
			screenSize.current = { width: window.innerWidth, height: window.innerHeight };
			if (stageRef.current) {
				stageRef.current.width(screenSize.current.width);
				stageRef.current.height(screenSize.current.height);
			}
		}

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, []);
    

	const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
		e.evt.preventDefault();
		if (!stageRef.current) return;

		const stage: Konva.Stage = stageRef.current;
		const oldScale: number = stage.scaleX();
		const pointer: { x: number; y: number } | null = stage.getPointerPosition();

		if (!pointer) return;
		const mousePointTo: { x: number; y: number } = {
			x: (pointer.x - stage.x()) / oldScale,
			y: (pointer.y - stage.y()) / oldScale,
		};

		let direction: number = e.evt.deltaY > 0 ? -1 : 1;
		if (e.evt.ctrlKey)
			direction = -direction;
		
		let newScale: number = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
		newScale = Math.max(10, Math.min(400, newScale));
		stage.scale({ x: newScale, y: newScale });
		stage.position({
			x: pointer.x - mousePointTo.x * newScale,
			y: pointer.y - mousePointTo.y * newScale,
		});
	};
	if (!map.data.is_ok()) {
		return (
			<div style={{ padding: '20px', color: 'red' }}>
				<h2>Errors in map data:</h2>
				<ul>
					{map.data.errors.map((error, index) => (
						<li key={index}>
							<strong>Line {error.line_number}:</strong> {error.message}
							<br />
							<em>{error.line}</em>
						</li>
					))}
				</ul>
			</div>
		);
	}
	const nodes = map.data.nodes.map(node => <Node key={node.name} node={node} />);

	return (
		<>
			<Stage ref={stageRef} width={screenSize.current.width} height={screenSize.current.height} scaleX={80} scaleY={80} draggable  onWheel={handleWheel}>
				<Layer>
					{gridDots.map(function (d, i) {
						return <Circle key={'g' + i} x={d.x} y={d.y} radius={0.01} fill="#ccc" listening={false} />
					})}
					{nodes}
				</Layer>
			</Stage>
		</>
	);
};

export default App;
