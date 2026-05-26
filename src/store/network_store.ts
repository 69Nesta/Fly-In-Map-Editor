import { create } from 'zustand';
import { EZoneType, Node } from '@/context/node';
import { type Connection } from '@/context/connection';
import { type MapData } from '@/context/map_loader';


export type NetworkStore = {
	nb_drones: number;
	setNbDrones: (nb_drones: number) => void;

	nodes: Node[];
	addNode: (node: Node) => void;
	removeNode: (node: Node) => void;
	moveNode: (node: Node, x: number, y: number) => void;
	changeNodeColor: (node: Node, color: string) => void;
	changeNodeName: (node: Node, name: string) => void;
	changeMaxDrones: (node: Node, max_drones: number) => void;
	changeZoneType: (node: Node, zone_type: EZoneType) => void;
	changeIsStart: (node: Node, is_start: boolean) => void;
	changeIsEnd: (node: Node, is_end: boolean) => void;

	connections: Connection[];
	addConnection: (connection: Connection) => void;
	removeConnection: (connection: Connection) => void;
	editConnection: (connection: Connection, new_from: Node, new_to: Node) => void;
	changeConnectionMaxLinkCapacity: (connection: Connection, max_link_capacity: number) => void;

	import: (data: MapData) => void;
	export: () => string[];
};


export const useNetworkStore = create<NetworkStore>((set) => ({
	nb_drones: 0,
	setNbDrones: (nb_drones) =>
		set({
			nb_drones,
		}),

	nodes: [],
	addNode: (node) =>
		set((state) => ({
			nodes: [...state.nodes, node],
		})),
	removeNode: (node) =>
		set((state) => ({
			nodes: state.nodes.filter((n) => n !== node),
			connections: state.connections.filter(
				(c) => c.node1 !== node && c.node2 !== node
			),
		})),
	moveNode: (node, x, y) =>
		set((state) => ({
			nodes: state.nodes.map((n) => {
				if (n === node)
					n.setPosition(x, y);

				return n;
			}),
		})),
	changeNodeColor: (node, color) =>
		set((state) => ({
			nodes: state.nodes.map((n) => {
				if (n === node)
					n.setColor(color);

				return n;
			}),
		})),
	changeNodeName: (node, name) =>
		set((state) => ({
			nodes: state.nodes.map((n) => {
				if (n === node)
					n.name = name;

				return n;
			}),
		})),
	changeMaxDrones: (node, max_drones) =>
		set((state) => ({
			nodes: state.nodes.map((n) => {
				if (n === node)
					n.setMaxDrones(max_drones);

				return n;
			}),
		})),
	changeZoneType: (node, zone_type) =>
		set((state) => ({
			nodes: state.nodes.map((n) => {
				if (n === node)
					n.setZoneType(zone_type);

				return n;
			}),
		})),
	changeIsStart: (node, is_start) =>
		set((state) => ({
			nodes: state.nodes.map((n) => {
				if (n === node)
				{
					n.setStart(is_start);
					n.setEnd(false);
				}

				return n;
			}),
		})),
	changeIsEnd: (node, is_end) =>
		set((state) => ({
			nodes: state.nodes.map((n) => {
				if (n === node)
				{
					n.setEnd(is_end);
					n.setStart(false);
				}

				return n;
			}),
		})),

	connections: [],
	addConnection: (connection) =>
		set((state) => ({
			connections: [...state.connections, connection],
		})),
	removeConnection: (connection) =>
		set((state) => ({
			connections: state.connections.filter((c) => c !== connection),
		})),
	editConnection: (connection, new_from, new_to) =>
		set((state) => ({
			connections: state.connections.map((c) =>
				c === connection
					? Object.assign(c, {
						id: `${new_from.name}-${new_to.name}`,
						node1: new_from,
						node2: new_to,
					})
					: c
			),
		})),
		changeConnectionMaxLinkCapacity: (connection, max_link_capacity) =>
		set((state) => ({
			connections: state.connections.map((c) => {
				if (c === connection)
					c.metadata.max_link_capacity = max_link_capacity;

				return c;
			}),
		})),

	import: (data) =>
		set({
			nb_drones: data.nb_drones,
			nodes: data.nodes,
			connections: data.connections,
		}),

	export: () => {
		const lines: string[] = [];

		lines.push(`nb_drones: ${useNetworkStore.getState().nb_drones}`);
		lines.push('');

		for (const node of useNetworkStore.getState().nodes)
			lines.push(node.export());
		lines.push('');

		for (const connection of useNetworkStore.getState().connections)
			lines.push(connection.export());
		lines.push('');

		return lines;
	}
}));