import type { EditorStore } from "@/store/editor_store"
import { handleDelete } from "./handle_delete"
import { handleUnselectElement } from "./handle_unselect_element"


export const keydownHook = (e: KeyboardEvent, editorStore: EditorStore) => {
	handleDelete(e)

	if (e.key === 'Escape')
		handleUnselectElement(editorStore)
}
