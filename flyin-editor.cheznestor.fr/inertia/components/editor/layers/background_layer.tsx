import { Layer, Circle } from 'react-konva'
import { memo } from 'react';


const spacing: number = 1;
const range: number = 30;

const gridDots: { x: number; y: number }[] = [];

for (let gx = -range; gx <= range; gx += spacing) {
	for (let gy = -range; gy <= range; gy += spacing) {
		gridDots.push({ x: gx, y: gy });
	}
}

function BackgroundLayer() {
	return <Layer>
		{gridDots.map(function (d, i) {
			return <Circle key={'bg-dot-' + i} x={d.x} y={d.y} radius={0.01} fill="#ccc" listening={false} />
		})}
	</Layer>
}


const MemoBackgroundLayer = memo(BackgroundLayer);


export { MemoBackgroundLayer }