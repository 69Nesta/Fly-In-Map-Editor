import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupTextarea } from '../ui/input-group';
import { ChevronRight, Copy, Loader2, MinusIcon, PanelRightClose, PlusIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '~/components/ui/button';

import { useNetworkStore } from '~/store/network_store';
import { useClipboard } from '~/hooks/clipboard';

type RightPanelProps = {
	onHide: () => void;
};

export function RightPanel({ onHide }: RightPanelProps) {
	const nbDrones = useNetworkStore((state) => state.nb_drones);
	const setNbDrones = useNetworkStore((state) => state.setNbDrones);
	const nodes = useNetworkStore((state) => state.nodes);
	const connections = useNetworkStore((state) => state.connections);
	const [exportCode, setExportCode] = useState(() => useNetworkStore.getState().export().join('\n'));
	const [isGenerating, setIsGenerating] = useState(false);
	const [isCopying, setIsCopying] = useState(false);

	useEffect(() => {
		let cancelled = false;
		setIsGenerating(true);

		const timeoutId = window.setTimeout(() => {
			if (cancelled)
				return;

			const nextExport = useNetworkStore.getState().export().join('\n');
			setExportCode(nextExport);
			setIsGenerating(false);
		}, 0);

		return () => {
			cancelled = true;
			window.clearTimeout(timeoutId);
		};
	}, [nbDrones, nodes, connections]);

	const copyLabel = useMemo(() => {
		if (isCopying)
			return 'Copying...';

		return exportCode ? 'Copy' : 'Nothing to copy';
	}, [exportCode, isCopying]);

	const handleCopy = async () => {
		if (!exportCode)
			return;

		setIsCopying(true);
		await useClipboard(exportCode);
		window.setTimeout(() => setIsCopying(false), 350);
	};

	return (
		<div className='flex h-full flex-col border-l border-border/60 bg-background p-4'>
			<div className='mb-4 flex items-center justify-between gap-2'>
				<div>
					<p className='text-sm font-semibold'>Map settings</p>
					<p className='text-xs text-muted-foreground'>Edit the drone count and inspect the generated code.</p>
				</div>
				<Button variant='ghost' size='icon-sm' onClick={onHide} aria-label='Hide right panel'>
					<PanelRightClose />
				</Button>
			</div>

			<div className='space-y-2'>
				<InputGroup>
					<InputGroupInput
						className='no-spinner'
						placeholder='1'
						type='number'
						min={1}
						step={1}
						value={nbDrones}
						onChange={(event) => {
							const nextValue = Number.parseInt(event.target.value, 10);
							if (Number.isNaN(nextValue))
								return;

							setNbDrones(nextValue);
						}} />
					<InputGroupAddon align="inline-end">
						<InputGroupButton
							aria-label="Plus"
							title="Plus"
							size="icon-xs"
							onClick={() => {
								setNbDrones(nbDrones + 1)
							}}
						>
							<PlusIcon />
						</InputGroupButton>
						<InputGroupButton
							aria-label="Minus"
							title="Minus"
							size="icon-xs"
							onClick={() => {
								setNbDrones(Math.max(1, nbDrones - 1))
							}}
						>
							<MinusIcon />
						</InputGroupButton>
					</InputGroupAddon>
				</InputGroup>
			</div>

			<div className='mt-6 flex min-h-0 flex-1 flex-col gap-2'>
				<div className='flex items-center justify-between gap-2'>
					<div>
						<p className='text-sm font-medium'>Export map</p>
						<p className='text-xs text-muted-foreground'>Generated asynchronously to keep the editor responsive.</p>
					</div>
					<Button variant='outline' size='sm' onClick={handleCopy} disabled={!exportCode || isCopying}>
						{isCopying ? <Loader2 className='animate-spin' /> : exportCode ? <Copy /> : <ChevronRight />}
						{copyLabel}
					</Button>
				</div>

				<InputGroup className='min-h-0 flex-1 items-start'>
					<InputGroupTextarea
						readOnly
						wrap='off'
						value={exportCode}
						className='min-h-full font-mono text-xs resize-none scrollbar-custom'
					/>
					<InputGroupAddon align='inline-end' className='bg-transparent'>
						{isGenerating ? <Loader2 className='animate-spin' /> : ''}
					</InputGroupAddon>
				</InputGroup>
			</div>
		</div>
	);
}
