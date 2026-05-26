import { Node } from "@/context/node";
import { EZoneType, NodeMetadata } from "@/context/node/node";
import type { NetworkStore } from "@/store/network_store";
import type Konva from "konva";


export function handleNewNode(network: NetworkStore, e: Konva.KonvaEventObject<MouseEvent>) {
	const pos = e.target.getStage()?.getRelativePointerPosition();
	if (!pos) return;

	const x = Math.round(pos.x);
	const y = Math.round(pos.y);

	if (network.nodes.some(n => n.x === x && n.y === y)) return;

	const names = network.nodes.map(n => n.name);
	let i = 1;
	while (names.includes(`node_${i.toString(16)}`))
		i++;

	const newNode = new Node(`node_${i.toString(16)}`, x, y, new NodeMetadata(1, 'white', EZoneType.NORMAL));
	network.addNode(newNode);
}
