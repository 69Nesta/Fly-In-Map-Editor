import { type Connection as ConnectionContext } from '@/context/connection';
import { Line } from 'react-konva';


interface ConnectionProps {
	connection: ConnectionContext;
}


export function Connection({ connection }: ConnectionProps) {
	return <>
		<Line
			points={[
				connection.node1.x, connection.node1.y,
				connection.node2.x, connection.node2.y
			]}
			strokeWidth={0.08}
			stroke="#4c4d51"
        />
	</>
}