import { type Connection as ConnectionContext } from '~/context/connection';
import { Line } from 'react-konva';
import { useEditorStore } from '~/store/editor_store';
import { useNetworkStore } from '~/store/network_store';


interface ConnectionProps {
	connection: ConnectionContext;
}


export function Connection({ connection }: ConnectionProps) {
	const x1 = useNetworkStore(() => connection.node1.x);
	const y1 = useNetworkStore(() => connection.node1.y);
	const x2 = useNetworkStore(() => connection.node2.x);
	const y2 = useNetworkStore(() => connection.node2.y);
	const current = useEditorStore((s) => s.currentSelectedElement);
	const setCurrent = useEditorStore((s) => s.setCurrentSelectedElement);
	const setCurrentCursorType = useEditorStore((s) => s.setCurrentCursorType);
	const resetCursorType = useEditorStore((s) => s.resetCursorType);

	const isSelected = current === connection;

	return <>
		<Line
			points={[
				x1, y1,
				x2, y2
			]}
			strokeWidth={isSelected ? 0.13 : 0.08}
			stroke={isSelected ? '#2563eb' : '#4c4d51'}
			hitStrokeWidth={0.15}
			onClick={(e) => {
				e.evt.preventDefault();
				setCurrent(connection);
			}}
			onMouseEnter={() => {
				setCurrentCursorType('hover_connection');
			}}
			onMouseLeave={() => {
				resetCursorType();
			}}
		/>
	</>
}