import type { Connection } from '@/context/connection';
import type { Node } from '@/context/node';
import { create } from 'zustand';

type Tool =
	| 'select'
	| 'node'
	| 'connection'

export type EditorStore = {
	projectModalOpen: boolean;
	setProjectModalOpen: (open: boolean) => void;

	currentTool: Tool;
	setTool: (tool: Tool) => void;

	currentSelectedElement: Node | Connection | null;
	setCurrentSelectedElement: (node: Node | Connection | null) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
	projectModalOpen: false,
	setProjectModalOpen: (open) =>
		set({
			projectModalOpen: open,
		}),

	currentTool: 'select',
	setTool: (tool) =>
		set({
			currentTool: tool,
		}),

	currentSelectedElement: null,
	setCurrentSelectedElement: (node) =>
		set({
			currentSelectedElement: node,
		}),
}));