import { handleUnselectElement } from './hook/handle_unselect_element';
import { MemoBackgroundLayer } from './layers/background_layer';
import { ConnectionsLayer } from './layers/connections_layer';
import { useRef, type RefObject, useEffect } from 'react'
import { useNetworkStore } from '@/store/network_store';
import { handleNewNode } from './hook/handle_new_node';
import { useEditorStore } from '@/store/editor_store';
import { NodesLayer } from './layers/nodes_layers';
import { Stage } from 'react-konva'
import Konva from 'konva'


export function EditorCanvas() {
	const stageRef: RefObject<Konva.Stage | null> = useRef<Konva.Stage | null>(null);
	const screenSize: RefObject<{ width: number, height: number }> = useRef({
		width: window.innerWidth,
		height: window.innerHeight
	});
	const scaleBy: number = 1.05;
	const currentTool = useEditorStore((s) => s.currentTool);
	const networkStore = useNetworkStore();
	const editorStore = useEditorStore();

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

	const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
		e.evt.preventDefault();
		if (e.target !== stageRef.current) return;
		
		if (currentTool === 'node')
			handleNewNode(networkStore, e);

		handleUnselectElement(editorStore);
	}

	return (
		<Stage
			ref={stageRef}
			className={'absolute'}
			width={screenSize.current.width}
			height={screenSize.current.height}
			scaleX={80} scaleY={80}
			offsetX={-7} offsetY={-5}
			draggable
			onWheel={handleWheel}
			onClick={handleClick}
		>
			<MemoBackgroundLayer />

			<ConnectionsLayer />

			<NodesLayer />
		</Stage>
	);
}