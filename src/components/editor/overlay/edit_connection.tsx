import type { Connection } from "@/context/connection";
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
import { useEditorStore } from "@/store/editor_store";
import { useEffect, useMemo, useState } from 'react';
import { Trash2 } from "lucide-react";


interface EditConnectionCardContentProps {
	selectedConnection: Connection;
}

export function EditConnectionCardContent({ selectedConnection }: EditConnectionCardContentProps) {
	const connections = useNetworkStore((s) => s.connections);
	const nodes = useNetworkStore((s) => s.nodes);
	const editConnection = useNetworkStore((s) => s.editConnection);
	const changeConnectionMaxLinkCapacity = useNetworkStore((s) => s.changeConnectionMaxLinkCapacity);

	const setCurrentSelectedElement = useEditorStore((s) => s.setCurrentSelectedElement);
	const removeConnection = useNetworkStore((s) => s.removeConnection);

	const selectedConnectionInStore = useMemo(() => {
		return connections.find((connection) => connection === selectedConnection || connection.id === selectedConnection.id) ?? selectedConnection;
	}, [connections, selectedConnection]);

	const [node1Name, setNode1Name] = useState('');
	const [node2Name, setNode2Name] = useState('');
	const [maxLinkCapacity, setMaxLinkCapacity] = useState('');

	useEffect(() => {
		if (!selectedConnectionInStore)
			return;

		setNode1Name(selectedConnectionInStore.node1.name);
		setNode2Name(selectedConnectionInStore.node2.name);
		setMaxLinkCapacity(String(selectedConnectionInStore.metadata.max_link_capacity));
	}, [
		selectedConnectionInStore,
		selectedConnectionInStore?.node1.name,
		selectedConnectionInStore?.node2.name,
		selectedConnectionInStore?.metadata.max_link_capacity,
	]);

	if (!selectedConnectionInStore)
		return null;

	const endpointOptions = nodes;

	const commitEndpoints = (nextNode1Name: string, nextNode2Name: string): boolean => {
		const nextNode1 = nodes.find((node) => node.name === nextNode1Name);
		const nextNode2 = nodes.find((node) => node.name === nextNode2Name);

		if (!nextNode1 || !nextNode2)
			return false;

		editConnection(selectedConnectionInStore, nextNode1, nextNode2);
		return true;
	};

	const commitMaxLinkCapacity = (nextValue: string): boolean => {
		const parsedValue = Number(nextValue);

		if (!Number.isFinite(parsedValue))
			return false;

		changeConnectionMaxLinkCapacity(selectedConnectionInStore, Math.max(0, Math.round(parsedValue)));
		return true;
	};

	return <>
		<CardHeader className='gap-2 border-b border-border/60 pb-4'>
			<CardTitle>Connection inspector</CardTitle>
			<CardDescription>
				Editing the link between {selectedConnectionInStore.node1.name} and {selectedConnectionInStore.node2.name}
			</CardDescription>
		</CardHeader>
		<CardContent className='space-y-5 pt-4'>
			<div className='grid grid-cols-2 gap-3'>
				<div className='space-y-2'>
					<Label htmlFor='connection-node1'>Node 1</Label>
					<Select
						value={node1Name}
						onValueChange={(nextNode1Name) => {
							setNode1Name(nextNode1Name);
							if (!commitEndpoints(nextNode1Name, node2Name))
								setNode1Name(selectedConnectionInStore.node1.name);
						}}
					>
						<SelectTrigger id='connection-node1' className='w-full'>
							<SelectValue placeholder='Choose node' />
						</SelectTrigger>
						<SelectContent>
							{endpointOptions.map((node) => (
								<SelectItem key={node.name} value={node.name}>
									{node.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='space-y-2'>
					<Label htmlFor='connection-node2'>Node 2</Label>
					<Select
						value={node2Name}
						onValueChange={(nextNode2Name) => {
							setNode2Name(nextNode2Name);
							if (!commitEndpoints(node1Name, nextNode2Name))
								setNode2Name(selectedConnectionInStore.node2.name);
						}}
					>
						<SelectTrigger id='connection-node2' className='w-full'>
							<SelectValue placeholder='Choose node' />
						</SelectTrigger>
						<SelectContent>
							{endpointOptions.map((node) => (
								<SelectItem key={node.name} value={node.name}>
									{node.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className='space-y-2'>
				<Label htmlFor='connection-max-link-capacity'>Max link capacity</Label>
				<Input
					id='connection-max-link-capacity'
					type='number'
					min='0'
					step='1'
					value={maxLinkCapacity}
					onChange={(event) => {
						const nextValue = event.target.value;
						setMaxLinkCapacity(nextValue);
						if (!commitMaxLinkCapacity(nextValue))
							setMaxLinkCapacity(String(selectedConnectionInStore.metadata.max_link_capacity));
					}}
				/>
			</div>
			<div className='text-sm text-muted-foreground'>
				Note: the max link capacity is the maximum number of drones that can be on this connection at the same time.
			</div>
			<div className='space-y-2'>
				<Button variant='destructive' onClick={() => {
					removeConnection(selectedConnectionInStore);
					setCurrentSelectedElement(null);
				}}>
					<Trash2 /> Delete connection
				</Button>
			</div>
		</CardContent>
	</>;
}
