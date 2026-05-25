import { type Node as NodeContext } from '@/context/node';
import { useNetworkStore } from '@/store/network_store';
import { useEditorStore } from '@/store/editor_store';

import { useRef, useState, useEffect } from 'react';
import { Circle, Text } from 'react-konva';
import type Konva from 'konva';


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

	const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
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
		if (currentTool === 'select')
			setCurrentSelectedElement(node);
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
				stroke={node.is_start ? '#ffffff' : node.is_end ? '#ffffff' : undefined}
				strokeWidth={0.02}
				scaleX={isHovered ? 1.1 : 1}
				scaleY={isHovered ? 1.1 : 1}
				draggable
				perfectDrawEnabled
				shadowColor='rgba(0,0,0,0.15)'
				shadowBlur={10}
				shadowOffsetY={4}
				onDragMove={handleDragMove}
				onClick={handleClick}
				onMouseEnter={(e) => {
					e.target.getStage()?.container().style.setProperty('cursor', 'move');
					setIsHovered(true);
				}}
				onMouseLeave={(e) => {
					e.target.getStage()?.container().style.setProperty('cursor', 'default');
					if (currentSelectedElement !== node)
						setIsHovered(false);
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
