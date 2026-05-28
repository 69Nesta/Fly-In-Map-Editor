import { useNetworkStore } from "~/store/network_store";
import { Node } from "../components/Node";
import { Layer } from "react-konva";

type NodesLayerProps = {
};

export function NodesLayer({ }: NodesLayerProps) {
	const network = useNetworkStore();

	return <Layer>
		{network.nodes.map((node, index) =>
			<Node key={`node-${node.name}-${index}`} node={node}/>
		)}
	</Layer>
}
