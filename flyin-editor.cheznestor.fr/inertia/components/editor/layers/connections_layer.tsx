import { Layer } from "react-konva";
import { Connection } from "../components/Connection";
import { useNetworkStore } from "~/store/network_store";


export function ConnectionsLayer() {
	const connections = useNetworkStore((s) => s.connections);
	
	return <Layer>
		{connections.map((connection, index) => (
			<Connection key={`connection-${connection.id}-${index}`} connection={connection} />
		))}
	</Layer>
}
