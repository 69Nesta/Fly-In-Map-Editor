import { Node as ContextNode } from '@/context/node';
import { Circle, Text } from 'react-konva';
import { useState } from 'react';
import type Konva from 'konva';


interface NodeProps {
	node: ContextNode;
}


const Node = ({ node }: NodeProps) => {
	const [pos, setPos] = useState({ x: node.x, y: node.y });
	const [color, setColor] = useState(node.metadata.color);
	const [isStart, setIsStart] = useState(node.is_start);
	const [isEnd, setIsEnd] = useState(node.is_end);

	const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
		const element = e.target;

		const x = Math.round(element.x());
		const y = Math.round(element.y());

		element.position({ x, y });
		setPos({ x, y });
		node.x = x;
		node.y = y;
	};

	return (
		<>
			<Circle
				key={`${node.name}-circle`}
				x={pos.x} y={pos.y}
				radius={isStart || isEnd ? 0.18 : 0.16}
				fill={color}
				stroke={isStart ? '#00fd15' : isEnd ? '#fd1500' : undefined}
				strokeWidth={0.04}
				draggable
				perfectDrawEnabled
				shadowColor='rgba(0,0,0,0.15)'
				shadowBlur={10}
				shadowOffsetY={4}
				onDragMove={handleDragMove}
			/>
			<Text
				key={`${node.name}-text`}
				x={pos.x - 1} y={pos.y + 0.25}
				width={2}
				text={node.name}
				fontSize={0.12}
				fontFamily={'Arial'}
				fill={'#333'}
				align={'center'}
			/>
		</>
		
	)
}


export { Node };
