import { Node } from './node/node';
import { Connection } from './connection';
import type { MapData } from './map_loader';


class Network {
	nb_drones: number;
	nodes: Node[];
	connections: Connection[];


	constructor() {
		this.nb_drones = 0;
		this.nodes = [];
		this.connections = [];
	}

	import(data: MapData) {
		this.nb_drones = data.nb_drones;
		this.nodes = data.nodes;
		this.connections = data.connections;
	}

	export(): string[] {
		const lines: string[] = [];

		lines.push(`nb_drones: ${this.nb_drones}`);
		lines.push('');

		for (const node of this.nodes)
			lines.push(node.export());
		lines.push('');

		for (const connection of this.connections)
			lines.push(connection.export());
		lines.push('');

		return lines;
	}
}


export { Network };
