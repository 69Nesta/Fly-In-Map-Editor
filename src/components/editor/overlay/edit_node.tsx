import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import { useNetworkStore } from '@/store/network_store';
import { useEditorStore } from '@/store/editor_store';
import { EZoneType, Node } from '@/context/node';
import { ENodeColor } from '@/enums/node_color';
import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';


const colorOptions = Object.values(ENodeColor);
const zoneOptions = Object.values(EZoneType);


interface EditNodeCardContentProps {
	selectedNode: Node;
}


export function EditNodeCardContent({ selectedNode }: EditNodeCardContentProps) {
	const currentSelectedElement = useEditorStore((s) => s.currentSelectedElement);
	const nodes = useNetworkStore((s) => s.nodes);
	const changeNodeName = useNetworkStore((s) => s.changeNodeName);
	const moveNode = useNetworkStore((s) => s.moveNode);
	const changeNodeColor = useNetworkStore((s) => s.changeNodeColor);
	const changeMaxDrones = useNetworkStore((s) => s.changeMaxDrones);
	const changeZoneType = useNetworkStore((s) => s.changeZoneType);
	const changeIsStart = useNetworkStore((s) => s.changeIsStart);
	const changeIsEnd = useNetworkStore((s) => s.changeIsEnd);

	const selectedNodeInStore = selectedNode
		? nodes.find((node) => node.name === selectedNode.name) ?? selectedNode
		: null;

	const [name, setName] = useState('');
	const [xValue, setXValue] = useState('');
	const [yValue, setYValue] = useState('');
	const [color, setColor] = useState('');
	const [maxDrones, setMaxDrones] = useState('');
	const [zoneType, setZoneType] = useState('');

	useEffect(() => {}, [currentSelectedElement]);

	useEffect(() => {
		if (!selectedNodeInStore)
			return;

		setName(selectedNodeInStore.name);
		setXValue(String(selectedNodeInStore.x));
		setYValue(String(selectedNodeInStore.y));
		setColor(selectedNodeInStore.metadata.color);
		setMaxDrones(String(selectedNodeInStore.metadata.max_drones));
		setZoneType(selectedNodeInStore.metadata.zone_type);
	}, [
		selectedNodeInStore?.name,
		selectedNodeInStore?.x,
		selectedNodeInStore?.y,
		selectedNodeInStore?.metadata.color,
		selectedNodeInStore?.metadata.max_drones,
		selectedNodeInStore?.metadata.zone_type,
	]);

	if (!selectedNodeInStore)
		return null;

	const commitPosition = (nextX: string, nextY: string): boolean => {
		const parsedX = Number(nextX);
		const parsedY = Number(nextY);

		if (Number.isFinite(parsedX) && Number.isFinite(parsedY))
		{
			const x = Math.round(parsedX);
			const y = Math.round(parsedY);

			for (const n in nodes) {
				if (nodes[n].x === x && nodes[n].y === y) {
					return false;
				}
			}
			moveNode(selectedNodeInStore, x, y);
			return true;
		}

		return false;
	};

	const nodeKind = selectedNodeInStore.is_start
		? 'Start hub'
		: selectedNodeInStore.is_end
			? 'End hub'
			: 'Node';

	return (
		<>
			<CardHeader className='gap-2 border-b border-border/60 pb-4'>
				<CardTitle>Node inspector</CardTitle>
				<CardDescription>
					Editing {nodeKind.toLowerCase()} {selectedNodeInStore.name}
				</CardDescription>
			</CardHeader>
			<CardContent className='space-y-5 pt-4'>
				<div className='space-y-2'>
					<Label htmlFor='node-name'>Name</Label>
					<Input
						id='node-name'
						value={name}
						onChange={(event) => {
							const nextName = event.target.value;
							setName(nextName);
							changeNodeName(selectedNodeInStore, nextName);
						}}
					/>
				</div>

				<div className='grid grid-cols-2 gap-3'>
					<div className='space-y-2'>
						<Label htmlFor='node-x'>X</Label>
						<Input
							id='node-x'
							type='number'
							value={xValue}
							onChange={(event) => {
								const nextValue = event.target.value;
								setXValue(nextValue);
								if (!commitPosition(nextValue, yValue))
									setXValue(String(selectedNodeInStore.x));
							}}
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='node-y'>Y</Label>
						<Input
							id='node-y'
							type='number'
							value={yValue}
							onChange={(event) => {
								const nextValue = event.target.value;
								setYValue(nextValue);
								if (!commitPosition(xValue, nextValue))
									setYValue(String(selectedNodeInStore.y));
							}}
						/>
					</div>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='node-color'>Color</Label>
					<Select
						value={color}
						onValueChange={(nextColor) => {
							setColor(nextColor);
							changeNodeColor(selectedNodeInStore, nextColor);
						}}
					>
						<SelectTrigger id='node-color' className='w-full'>
							<SelectValue placeholder='Choose color' />
						</SelectTrigger>
						<SelectContent>
							{colorOptions.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className='grid grid-cols-2 gap-3'>
					<div className='space-y-2'>
						<Label htmlFor='node-max-drones'>Max drones</Label>
						<Input
							id='node-max-drones'
							type='number'
							min='0'
							step='1'
							value={maxDrones}
							onChange={(event) => {
								const nextValue = event.target.value;
								setMaxDrones(nextValue);
								const parsedValue = Number(nextValue);
								if (Number.isFinite(parsedValue))
									changeMaxDrones(selectedNodeInStore, Math.max(0, Math.round(parsedValue)));
							}}
						/>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='node-zone-type'>Zone type</Label>
						<Select
							value={zoneType}
							onValueChange={(nextZoneType) => {
								setZoneType(nextZoneType);
								changeZoneType(selectedNodeInStore, nextZoneType as EZoneType);
							}}
						>
							<SelectTrigger id='node-zone-type' className='w-full'>
								<SelectValue placeholder='Zone type' />
							</SelectTrigger>
							<SelectContent>
								{zoneOptions.map((option) => (
									<SelectItem key={option} value={option}>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className='space-y-2'>
					<Label>Role</Label>
					<div className='flex gap-2'>
						<Button
							type='button'
							variant={!selectedNodeInStore.is_start && !selectedNodeInStore.is_end ? 'default' : 'outline'}
							onClick={() => {
								changeIsStart(selectedNodeInStore, false);
							}}
						>
							Normal
						</Button>
						<Button
							type='button'
							variant={selectedNodeInStore.is_start ? 'default' : 'outline'}
							onClick={() => {
								changeIsStart(selectedNodeInStore, true);
							}}
						>
							Start
						</Button>
						<Button
							type='button'
							variant={selectedNodeInStore.is_end ? 'default' : 'outline'}
							onClick={() => {
								changeIsEnd(selectedNodeInStore, true);
							}}
						>
							End
						</Button>
					</div>
				</div>
				<div className='text-sm text-muted-foreground'>
					Note: start hubs are where drones take off from, end hubs are where drones deliver their packages. Normal nodes are just transit points. A node can't be both a start and an end hub at the same time.
				</div>
				<div>
					<Button variant='destructive' onClick={() => {
						if (window.confirm('Are you sure you want to delete this node? This will also delete all connections linked to this node.'))
						{
							useNetworkStore.getState().removeNode(selectedNodeInStore);
							useEditorStore.getState().setCurrentSelectedElement(null);
						}
					}}>
						<Trash2 />Delete node
					</Button>
				</div>
			</CardContent>
		</>
	);
}
