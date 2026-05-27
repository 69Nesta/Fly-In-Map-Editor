import type { MapData } from "../map_loader";


class ConnectionMetadata {
	max_link_capacity: number;

	constructor(
				max_link_capacity: number | undefined = undefined,
			) {
		this.max_link_capacity = max_link_capacity ?? 1;
	}

	static parse(metadata_str: string | undefined, at_line: number, data_result: MapData): ConnectionMetadata {
		const metadata = new ConnectionMetadata();
		metadata_str = metadata_str?.trim();

		if (metadata_str) {
			const parts = metadata_str.split(',').map(part => part.trim());
			for (const part of parts) {
				const [key, value] = part.split('=').map(p => p.trim());
				if (key === 'max_link_capacity') {
					const capacity = parseInt(value, 10);
					if (!isNaN(capacity) && capacity >= 0) {
						metadata.max_link_capacity = capacity;
					} else {
						data_result.warnings.push({
							line: metadata_str,
							line_number: at_line,
							message: `Invalid max_link_capacity value: ${value}. Using default of 1.`
						});
					}
				} else {
					data_result.warnings.push({
						line: metadata_str,
						line_number: at_line,
						message: `Unknown connection metadata key: ${key}.`
					});
				}
			}
		}

		return metadata;
	}

	export(): string {
		if (this.max_link_capacity !== 1)
			return `[max_link_capacity=${this.max_link_capacity}]`;
		return '';
	}
}

export { ConnectionMetadata };