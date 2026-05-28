import { useEditorStore } from '~/store/editor_store';
import { Connection } from '~/context/connection';
import { Card } from '~/components/ui/card';
import { Node } from '~/context/node';

import { EditConnectionCardContent } from './edit_connection';
import { EditNodeCardContent } from './edit_node';


type CurrentSelectedElementProps = {
	readOnly?: boolean;
};

export function CurrentSelectedElement({ readOnly = false }: CurrentSelectedElementProps) {
	if (readOnly)
		return null;

	const currentSelectedElement = useEditorStore((s) => s.currentSelectedElement);

	if (!(currentSelectedElement instanceof Node) && !(currentSelectedElement instanceof Connection))
		return null;

	return (
		<Card className='absolute left-4 top-4 z-50 w-[min(24rem,calc(100vw-2rem))] border-border/60 bg-card/95 shadow-lg backdrop-blur supports-backdrop-filter:bg-card/80'>
			{currentSelectedElement instanceof Node ?
				<EditNodeCardContent selectedNode={currentSelectedElement} />
				:
				<EditConnectionCardContent selectedConnection={currentSelectedElement} />
			}
		</Card>
	);
}
