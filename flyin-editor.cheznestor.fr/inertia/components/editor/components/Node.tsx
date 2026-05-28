import { type Node as NodeContext } from '~/context/node';
import { useNetworkStore } from '~/store/network_store';
import { useEditorStore } from '~/store/editor_store';

import { useRef, useState, useEffect } from 'react';
import { Circle, Text } from 'react-konva';
import type Konva from 'konva';
import { Connection } from '~/context/connection';
import { ConnectionMetadata } from '~/context/metadata/connection_metadata';


interface NodeProps {
	node: NodeContext;
}


const Node = ({ node }: NodeProps) => {
	const network = useNetworkStore();
	const currentTool = useEditorStore((s) => s.currentTool);
	const currentSelectedElement = useEditorStore((s) => s.currentSelectedElement);
	const setCurrentSelectedElement = useEditorStore((s) => s.setCurrentSelectedElement);
	const textRef = useRef<Konva.Text>(null);
	const [isHovered, setIsHovered] = useState(false);
	const pendingConnectionFrom = useEditorStore((s) => s.pendingConnectionFrom);

	const setCurrentCursorType = useEditorStore((s) => s.setCurrentCursorType);
	const resetCursorType = useEditorStore((s) => s.resetCursorType);
	const readOnly = useEditorStore((s) => s.readOnly);

	const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
		if (readOnly)
			return;

		const element = e.target;
		if (currentTool !== 'select')
		{
			element.position({ x: node.x, y: node.y });
			return;
		}

		const x = Math.round(element.x());
		const y = Math.round(element.y());
		element.position({ x, y });

		if (x === node.x && y === node.y)
			return;
		for (const n in network.nodes) {
			if (network.nodes[n].x === x && network.nodes[n].y === y) {
				element.position({x: node.x, y: node.y});
				return;
			}
		}
		network.moveNode(node, x, y);
	};

	const handleClick = () => {
		if (readOnly)
			return;

		if (currentTool === 'select' || currentTool === 'node') {
			setCurrentSelectedElement(node);
			return;
		}

		if (currentTool === 'connection' && !readOnly) {
			const pending = useEditorStore.getState().pendingConnectionFrom;
			const setPending = useEditorStore.getState().setPendingConnectionFrom;

			if (!pending) {
				setPending(node);
				return;
			}

			if (pending === node) {
				setPending(null);
				return;
			}

			if (pending && pending !== node) {
				const newConn = new Connection(`${pending.name}-${node.name}`, pending, node, new ConnectionMetadata());
				const exists = useNetworkStore.getState().connections.some((c) => c.equals(newConn));
				if (!exists) {
					useNetworkStore.getState().addConnection(newConn);
					setCurrentSelectedElement(newConn);
				}
				setPending(null);
				return;
			}
		}
	};

	useEffect(() => {
		if (currentSelectedElement !== node)
			setIsHovered(false);
	}, [currentSelectedElement]);

	return (
		<>
			<Circle
				key={`${node.name}-circle`}
				x={node.x} y={node.y}
				radius={0.16}
				fill={node.metadata.color}
				stroke={pendingConnectionFrom === node ? '#f59e0b' : node.is_start ? '#ffffff' : node.is_end ? '#ffffff' : undefined}
				strokeWidth={0.02}
				scaleX={isHovered ? 1.1 : 1}
				scaleY={isHovered ? 1.1 : 1}
				draggable={!readOnly && currentTool === 'select'}
				shadowColor='rgba(0,0,0,0.15)'
				shadowBlur={10}
				shadowOffsetY={4}
				onDragMove={handleDragMove}
				onClick={handleClick}
				onMouseEnter={() => {
					setCurrentCursorType('hover_node');
					setIsHovered(true);
				}}
				onMouseLeave={() => {
					resetCursorType();
					if (currentSelectedElement !== node) setIsHovered(false);
				}}
				onDragStart={() => {
					if (readOnly)
						return;

					setCurrentCursorType('drag_node');
				}}
				onDragEnd={() => {
					if (readOnly)
						return;

					resetCursorType();
				}}
			/>
			<Text
				ref={textRef}
				key={`${node.name}-text`}
				x={node.x - 1} y={node.y + 0.27}
				width={2}
				text={node.name}
				fontSize={0.15}
				fontFamily={'Arial'}
				fill={'#fff'}
				align={'center'}
			/>
		</>
	)
}


export { Node };
