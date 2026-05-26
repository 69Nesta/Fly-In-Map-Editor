import { handleUnselectElement } from './hook/handle_unselect_element';
import { MemoBackgroundLayer } from './layers/background_layer';
import { ConnectionsLayer } from './layers/connections_layer';
import { useRef, type RefObject, useEffect, useMemo } from 'react'
import { useNetworkStore } from '@/store/network_store';
import { handleNewNode } from './hook/handle_new_node';
import { useEditorStore } from '@/store/editor_store';
import { NodesLayer } from './layers/nodes_layers';
import { handleWheel } from './hook/handle_wheel';
import { Stage } from 'react-konva'
import Konva from 'konva'
import { keydownHook } from './hook/keydown_hook';


interface EditorCanvasProps {
	parent: RefObject<HTMLDivElement | null>;
}


export function EditorCanvas({ parent }: EditorCanvasProps) {
	const stageRef: RefObject<Konva.Stage | null> = useRef<Konva.Stage | null>(null);
	const getScreenSize = () => ({
		width: parent.current?.offsetWidth || window.innerWidth,
		height: parent.current?.offsetHeight || window.innerHeight,
	});
	const screenSize: RefObject<{ width: number, height: number }> = useRef({
		...getScreenSize(),
	});
	const currentTool = useEditorStore((s) => s.currentTool);
	const networkStore = useNetworkStore();
	const editorStore = useEditorStore();
	const currentCursorType = useEditorStore((s) => s.currentCursorType);

	useEffect(() => {
		const syncSize = () => {
			screenSize.current = getScreenSize();
			if (stageRef.current) {
				stageRef.current.width(screenSize.current.width);
				stageRef.current.height(screenSize.current.height);
			}
		}

		let resizeObserver: ResizeObserver | null = null;
		let frameId: number | null = null;

		const startObservingParent = () => {
			if (!parent.current) {
				frameId = window.requestAnimationFrame(startObservingParent);
				return;
			}

			syncSize();
			resizeObserver = new ResizeObserver(syncSize);
			resizeObserver.observe(parent.current);
		}

		startObservingParent();
		window.addEventListener('resize', syncSize);

		return () => {
			window.removeEventListener('resize', syncSize);
			resizeObserver?.disconnect();
			if (frameId !== null) window.cancelAnimationFrame(frameId);
		}
	}, [parent]);

	useEffect(() => {
		window.addEventListener('keydown', (e) => keydownHook(e, editorStore));
		return () => window.removeEventListener('keydown', (e) => keydownHook(e, editorStore));
	}, []);

	const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
		e.evt.preventDefault();
		if (e.target !== stageRef.current) return;

		if (currentTool === 'node')
			handleNewNode(networkStore, e);

		handleUnselectElement(editorStore);
	}

	const calculateCursor = () => {
		if (currentCursorType === 'hover_connection' || currentCursorType === 'hover_node')
			return 'pointer';

		if (currentTool === 'select')
			return currentCursorType === 'drag_node' ? 'grabbing' : 'default';
		else if (currentTool === 'node')
			return 'crosshair';
		else if (currentTool === 'connection')
			return 'default';
	}

	const cursor = useMemo(() => calculateCursor(), [currentCursorType, currentTool]);

	return (
		<Stage
			ref={stageRef}
			className={'absolute'}
			style={{
				cursor: cursor,
			}}
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