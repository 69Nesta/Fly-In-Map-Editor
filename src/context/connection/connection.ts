import { type Node } from '../node';
import { ConnectionMetadata } from '../metadata';
import type { MapData } from '../map_loader';


const RE_CONNECTION: RegExp = /^connection: (\w+)-(\w+)(?:\s+\[([^\]]*)\])?$/;


class Connection {
	id: string;
	node1: Node;
	node2: Node;
	metadata: ConnectionMetadata;

	constructor(id: string, node1: Node, node2: Node, metadata: ConnectionMetadata) {
		this.id = id;
		this.node1 = node1;
		this.node2 = node2;
		this.metadata = metadata;
	}

	static parse(line: string, at_line: number, data_result: MapData): Connection | null {
		const [, node1_name, node2_name, metadata_str] = RE_CONNECTION.exec(line) ?? [];
		if (node1_name && node2_name) {
			const node1 = data_result.nodes.find(node => node.name === node1_name);
			const node2 = data_result.nodes.find(node => node.name === node2_name);

			if (node1 && node2) {
				const metadata = ConnectionMetadata.parse(metadata_str, at_line, data_result);
				return new Connection(`${node1_name}-${node2_name}`, node1, node2, metadata);
			}
			else {
				if (!node1) {
					data_result.errors.push({
						line: line,
						line_number: at_line,
						message: `Node "${node1_name}" not found for connection.`
					});
				}
				if (!node2) {
					data_result.errors.push({
						line: line,
						line_number: at_line,
						message: `Node "${node2_name}" not found for connection.`
					});
				}
			}
		}
		return null;
	}

	equals(other: Connection): boolean {
		return (this.node1 === other.node1 && this.node2 === other.node2) ||
			   (this.node1 === other.node2 && this.node2 === other.node1);
	}

	export(): string {
		const metadata_str = this.metadata.export();

		return `connection: ${this.node1.name}-${this.node2.name}${metadata_str ? ` ${metadata_str}` : ''}`;
	}
}

export { Connection };
