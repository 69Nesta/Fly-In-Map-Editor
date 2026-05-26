import { useEditorStore } from "@/store/editor_store";
import { useNetworkStore } from "@/store/network_store";
import { Connection } from "@/context/connection";
import { Node } from "@/context/node";


export const handleDelete = (e: KeyboardEvent) => {
	if (e.key !== 'Delete' && e.key !== 'Backspace') return;

	const active = document.activeElement as HTMLElement | null;
	if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable))
		return;

	const selected = useEditorStore.getState().currentSelectedElement;
	if (!selected)
		return;

	if (selected instanceof Connection)
		useNetworkStore.getState().removeConnection(selected);
	else if (selected instanceof Node)
		useNetworkStore.getState().removeNode(selected);

	useEditorStore.getState().setCurrentSelectedElement(null);
};
