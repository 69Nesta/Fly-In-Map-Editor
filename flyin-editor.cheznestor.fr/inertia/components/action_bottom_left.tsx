import { useEditorStore } from "~/store/editor_store";
import { About } from "./about/about";
import { Button } from "./ui/button";
import { Loader2, Save } from "lucide-react";

type ActionBottomLeftProps = {
	onForceSave: () => void;
	isSaving: boolean;
	canForceSave: boolean;
};


export function ActionBottomLeft({ onForceSave, isSaving, canForceSave }: ActionBottomLeftProps) {
	const readOnly = useEditorStore((state) => state.readOnly);

	return <div className='absolute bottom-2 left-2 z-20 flex flex-col gap-2'>
		{!readOnly && canForceSave ? (
			<Button
				variant='outline'
				size='default'
				className='gap-2'
				onClick={onForceSave}
				disabled={isSaving}
				aria-label='Save project'
			>
				{isSaving ? <Loader2 className='animate-spin' /> : <Save />}
			</Button>
		) : null}
		<About />
	</div>
}