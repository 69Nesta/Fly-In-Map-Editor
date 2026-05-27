import { useEditorStore } from '~/store/editor_store';
import { IconFolderCode } from '@tabler/icons-react'
import { Textarea } from '~/components/ui/textarea';
import { MapLoader } from '~/context/map_loader';
import { Button } from '~/components/ui/button';
import { type RefObject, useRef } from 'react';
import { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '~/components/ui/dialog';
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	EmptyDescription,
	EmptyContent
} from '~/components/ui/empty';
import { useNetworkStore } from '~/store/network_store';



export function ProjectModal() {
	const [importState, setImportState] = useState<boolean>(false);
	const importRef: RefObject<HTMLTextAreaElement | null> = useRef<HTMLTextAreaElement | null>(null);
	const projectModalOpen = useEditorStore((s) => s.projectModalOpen);
	const setProjectModalOpen = useEditorStore((s) => s.setProjectModalOpen);
	const network = useNetworkStore();

	const close = () => setProjectModalOpen(false);

	const handleImport = () => {
		if (!importRef.current)
			return;
		const content = importRef.current.value;
		const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
		const mapLoader = new MapLoader(lines);
		const data = mapLoader.data;

		network.import(data);

		console.log(network.export().join('\n'));

		setImportState(false);
		close();
	}

	const handleNewProject = () => {
		network.clear();
		setImportState(false);
		close();
	}

	return (
		<Dialog open={projectModalOpen} onOpenChange={(v) => setProjectModalOpen(!!v)}>
			<DialogContent
				// showCloseButton={false}
				// onEscapeKeyDown={(e) => e.preventDefault()}
				// onPointerDownOutside={(e) => { e.preventDefault(); }}
			>
				{!importState ? <DialogHeader>
						<DialogTitle></DialogTitle>
						<DialogDescription></DialogDescription>
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant='icon'>
									<IconFolderCode />
								</EmptyMedia>
								<EmptyTitle>No Projects Yet</EmptyTitle>
								<EmptyDescription>
									You haven&apos;t created any projects yet. Get started by creating
									your first project.
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent className='flex-row justify-center gap-2'>
								<Button onClick={() => setImportState(true)} variant='outline'>Import Project</Button>
								<Button onClick={handleNewProject} autoFocus>Create New Project</Button>
							</EmptyContent>
						</Empty>
					</DialogHeader>
				: <>
					<DialogHeader>
						<DialogTitle>Import Map</DialogTitle>
						<DialogDescription>
							Paste the content of a map file here to import it into the editor.
						</DialogDescription>
						<Textarea
							ref={importRef}
							className={'h-50 min-h-30'}
							placeholder={'nb_drones: 2\nstart_hub: start 0 0 [max_drones=2]\n...'}
						/>
					</DialogHeader>
					<DialogFooter>
						<Button onClick={() => setImportState(false)} variant='outline'>Back</Button>
						<Button onClick={handleImport}>Import</Button>
					</DialogFooter>
				</>
				}
			</DialogContent>
		</Dialog>
	);
}