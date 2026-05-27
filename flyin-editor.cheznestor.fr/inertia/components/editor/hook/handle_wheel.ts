import type Konva from "konva";


const scaleBy: number = 1.05;


export const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
	e.evt.preventDefault();
	const stage: Konva.Stage | null = e.target.getStage();
	if (!stage) return;

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
