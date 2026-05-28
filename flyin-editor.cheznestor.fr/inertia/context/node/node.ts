import { Connection } from '../connection';
import { NodeMetadata } from '../metadata';
import { MapData } from '../map_loader';
import { EZoneType } from '.';


const RE_NODE: RegExp = /^(\w+):\s+(\w+)\s+(-?\d+)\s+(-?\d+)(?:\s+\[([^\]]*)\])?$/;


class Node {
	name: string;
	x: number;
	y: number;
	metadata: NodeMetadata;
	is_end: boolean;
	is_start: boolean;

	connections: Connection[];

	constructor(name: string, x: number, y: number, metadata: NodeMetadata, is_start: boolean = false, is_end: boolean = false) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.metadata = metadata;
		this.is_start = is_start;
		this.is_end = is_end;


		this.connections = [];
	}

	setPosition(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	setColor(color: string) {
		this.metadata.setColor(color);
	}

	setMaxDrones(max_drones: number) {
		this.metadata.setMaxDrones(max_drones);
	}

	setZoneType(zone_type: EZoneType) {
		this.metadata.setZoneType(zone_type);
	}

	setEnd(is_end: boolean = true) {
		this.is_end = is_end;
	}

	setStart(is_start: boolean = true) {
		this.is_start = is_start;
	}

	addConnection(connection: Connection) {
		this.connections.push(connection);
	}

	removeConnection(connection: Connection) {
		this.connections = this.connections.filter(conn => conn !== connection);
	}

	static parse(line: string, at_line: number, data_result: MapData): Node | null {
		const [, node_type, name, x_str, y_str, metadata_str] = RE_NODE.exec(line) ?? [];
		if (node_type && name && x_str && y_str) {
			const x: number = parseInt(x_str, 10);
			const y: number = parseInt(y_str, 10);

			const metadata = NodeMetadata.parse(metadata_str, at_line, data_result);
			return new Node(name, x, y, metadata, node_type === 'start_hub', node_type === 'end_hub');
		}
		else {
			data_result.errors.push({
				line: line,
				line_number: at_line,
				message: `Invalid node definition. Expected format: "type: name x y [metadata]".`
			});
		}
		return null;
	}

	export(): string {
		const type_str = this.is_start ? 'start_hub' : this.is_end ? 'end_hub' : 'hub';
		const metadata_str = this.metadata.export();

		return `${type_str}: ${this.name} ${this.x} ${this.y}${metadata_str ? ` ${metadata_str}` : ''}`;
	}
}

export { Node, NodeMetadata, EZoneType };