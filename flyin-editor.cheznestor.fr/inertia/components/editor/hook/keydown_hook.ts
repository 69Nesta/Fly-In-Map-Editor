import type { EditorStore } from "~/store/editor_store"
import { handleDelete } from "./handle_delete"
import { handleUnselectElement } from "./handle_unselect_element"


export const keydownHook = (e: KeyboardEvent, editorStore: EditorStore) => {
	if (editorStore.readOnly)
		return

	handleDelete(e)

	if (e.key === 'Escape')
		handleUnselectElement(editorStore)

	if (e.key === '1')
		editorStore.setTool('select')
	else if (e.key === '2')
		editorStore.setTool('connection')
	else if (e.key === '3')
		editorStore.setTool('node')
}
