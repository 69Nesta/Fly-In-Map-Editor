import { Node } from './node';
import { Connection } from './connection';


const RE_NB_DRONES: RegExp = /^nb_drones:\s*(\d+)$/;
const RE_NODE: RegExp = /^(start_hub|end_hub|hub):/;
const RE_CONNECTION: RegExp = /^connection:\s*/;


class ParsingError extends Error {
	line_number: number;
	line: string;

	constructor(message: string, line_number: number, line: string) {
		super(message);
		this.line_number = line_number;
		this.line = line;
	}
}


class MapData {
	nb_drones: number;
	nodes: Node[];
	connections: Connection[];

	warnings: {line: string, line_number: number, message: string}[];
	errors: {line: string, line_number: number, message: string}[];

	constructor()
	{
		this.nb_drones = 0;
		this.nodes = [];
		this.connections = [];

		this.warnings = [];
		this.errors = [];
	}

	is_ok(): boolean {
		return this.errors.length === 0;
	}
}


class MapLoader {
	data: MapData;
	
	constructor(lines: string[]) {
		this.data = new MapData();

		const cleaned_lines = this.remove_comments(lines);
		this.parse(cleaned_lines);
	}

	remove_comments(lines: string[]): {line: string, line_number: number}[] {
		const result: {line: string, line_number: number}[] = [];

		for (const [line_number, line] of lines.entries()) {
			const cleaned_line = line.split('#')[0].trim();
			if (cleaned_line.length > 0) {
				result.push({line: cleaned_line, line_number: line_number + 1});
			}
		}
		return result;
	}

	parse(map: {line: string, line_number: number}[]): void {
		for (const {line, line_number} of map) {
			if (RE_NB_DRONES.test(line)) {
				const match = RE_NB_DRONES.exec(line);
				if (match) {
					if (this.data.nb_drones !== 0) {
						this.data.warnings.push({
							line,
							line_number,
							message: 'Duplicate nb_drones definition, overwriting previous value.'
						});
					}
					this.data.nb_drones = parseInt(match[1], 10);
				}
				else {
					this.data.errors.push({
						line,
						line_number,
						message: 'Invalid nb_drones format.'
					});
				}

			} else if (RE_NODE.test(line)) {
				const node = Node.parse(line, line_number, this.data);
				if (node)
					this.data.nodes.push(node);

			} else if (RE_CONNECTION.test(line)) {
				const connection = Connection.parse(line, line_number, this.data);
				if (connection)
					this.data.connections.push(connection);

			} else {
				this.data.warnings.push({line, line_number, message: 'Unrecognized line'});
			}
		}
	}
}


export { MapLoader, ParsingError, MapData };
