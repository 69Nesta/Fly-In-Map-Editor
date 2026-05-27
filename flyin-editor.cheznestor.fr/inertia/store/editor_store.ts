import type { Connection } from '~/context/connection';
import type { Node } from '~/context/node';
import { create } from 'zustand';

export type Tool =
	| 'select'
	| 'node'
	| 'connection';


export type CurrentCursorAction =
	| 'default'
	| 'hover_connection'
	| 'hover_node'
	| 'drag_node'


export type EditorStore = {
	projectModalOpen: boolean;
	setProjectModalOpen: (open: boolean) => void;

	currentTool: Tool;
	setTool: (tool: Tool) => void;

	currentSelectedElement: Node | Connection | null;
	setCurrentSelectedElement: (node: Node | Connection | null) => void;

	pendingConnectionFrom: Node | null;
	setPendingConnectionFrom: (node: Node | null) => void;

	currentCursorType: CurrentCursorAction;
	setCurrentCursorType: (cursorType: CurrentCursorAction) => void;
	resetCursorType: () => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
	projectModalOpen: true,
	setProjectModalOpen: (open) =>
		set({
			projectModalOpen: open,
		}),

	currentTool: 'select',
	setTool: (tool) =>
		set((state) => ({
			currentTool: tool,
			pendingConnectionFrom: state.pendingConnectionFrom && tool !== 'connection' ? null : state.pendingConnectionFrom,
		})),

	currentSelectedElement: null,
	setCurrentSelectedElement: (node) =>
		set({
			currentSelectedElement: node,
		}),
	pendingConnectionFrom: null,
	setPendingConnectionFrom: (node) =>
		set({
			pendingConnectionFrom: node,
		}),

	currentCursorType: 'default',
	setCurrentCursorType: (cursorType) =>
		set({
			currentCursorType: cursorType,
		}),
	resetCursorType: () =>
		set({
			currentCursorType: 'default',
		}),
}));