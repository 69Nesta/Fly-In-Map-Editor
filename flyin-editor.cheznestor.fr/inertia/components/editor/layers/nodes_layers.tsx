import { useNetworkStore } from "~/store/network_store";
import { Node } from "../components/Node";
import { Layer } from "react-konva";

export function NodesLayer() {
	const network = useNetworkStore();

	return <Layer>
		{network.nodes.map(node =>
			<Node key={node.name} node={node} />
		)}
	</Layer>
}
