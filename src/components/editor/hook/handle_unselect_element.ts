import type { EditorStore } from "@/store/editor_store";


export function handleUnselectElement(editorStore: EditorStore) {
	editorStore.setCurrentSelectedElement(null);
	editorStore.setPendingConnectionFrom(null);
}
