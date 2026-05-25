import { Card, CardContent, CardHeader } from "./ui/card";
import { useNetworkStore } from "@/store/network_store";
import { useEditorStore } from "@/store/editor_store";
import { Node } from "@/context/node";


export function CurrentSelectedElement() {
	const currentSelectedElement = useEditorStore((s) => s.currentSelectedElement);
	const network = useNetworkStore();

	if (!currentSelectedElement)
		return null;

	return (<>
		{currentSelectedElement instanceof Node ?
			<Card className={'absolute top-2 left-2 px-3 py-3'}>
				<CardHeader className={'text-sm'}>Current Selected Element</CardHeader>
				<CardContent>
					<p>Name: {currentSelectedElement.name}</p>
					<p>Pos: {currentSelectedElement.x}, {currentSelectedElement.y}</p>
					<button onClick={() => network.changeNodeColor(currentSelectedElement, 'cyan')}>Set as cyan</button>
				</CardContent>
			</Card>
		: ''}
	</>);
}
