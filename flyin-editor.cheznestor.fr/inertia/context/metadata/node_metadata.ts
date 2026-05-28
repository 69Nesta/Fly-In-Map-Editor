import { ENodeColor } from '../../enums/node_color';
import { EZoneType } from '../node';
import { MapData } from '../map_loader';


class NodeMetadata {
	max_drones: number;
	color: string;
	zone_type: EZoneType;
	color_set: boolean;

	constructor(
				max_drones: number | undefined = undefined,
				color: string | undefined = undefined,
				zone_type: EZoneType | undefined = undefined
			) {
		this.max_drones = max_drones ?? 1;
		this.color = color ?? 'white';
		this.color_set = color !== undefined;
		this.zone_type = zone_type ?? EZoneType.NORMAL;
	}

	setColor(color: string) {
		this.color = color;
		this.color_set = true;
	}

	setMaxDrones(max_drones: number) {
		this.max_drones = max_drones;
	}

	setZoneType(zone_type: EZoneType) {
		this.zone_type = zone_type;
	}

	static parse(metadata_str: string, at_line: number, data_result: MapData): NodeMetadata {
		const metadata = new NodeMetadata();
		if (!metadata_str || !metadata_str.trim())
			return metadata;

		const parts: string[] = metadata_str.split(' ').map(part => part.trim());
		for (const part of parts) {
			const [key, value] = part.split('=').map(s => s.trim());
			if (key && value) {
				switch (key) {
					case 'max_drones':
						metadata.max_drones = parseInt(value, 10);
						break;
					case 'color':
						if (!Object.values(ENodeColor).includes(value as ENodeColor)) {
							data_result.warnings.push({
								line: metadata_str,
								line_number: at_line,
								message: `Unknown color value: ${value}. Defaulting to "white".`
							});
							metadata.color = 'white';
						}
						else
							metadata.setColor(value);
						break;
					case 'zone_type':
						if (Object.values(EZoneType).includes(value as EZoneType)) {
							metadata.zone_type = value as EZoneType;
						}
						break;
					default:
						data_result.warnings.push({
							line: metadata_str,
							line_number: at_line,
							message: `Unknown metadata key: ${key}`
						});
						break;
				}
			}
		}
		return metadata;
	}

	export(): string {
		const parts: string[] = [];

		if (this.max_drones !== 1) {
			parts.push(`max_drones=${this.max_drones}`);
		}
		if (this.color_set) {
			parts.push(`color=${this.color}`);
		}
		if (this.zone_type !== EZoneType.NORMAL) {
			parts.push(`zone=${this.zone_type}`);
		}

		if (!parts.length)
			return '';

		return `[${parts.join(' ')}]`;
	}
}

export { NodeMetadata };
