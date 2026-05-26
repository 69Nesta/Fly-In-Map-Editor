import { Clipboard, ClipboardX, ClipboardCheck } from 'lucide-react'
import { useNetworkStore } from '@/store/network_store'
import { useClipboard } from '@/hooks/clipboard'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useState } from 'react'


type exportState = '' | 'generating' | 'copied' | 'error';


export function ActionTopRight() {
	const [exportIconState, setExportIconState] = useState<exportState>('')
	const network = useNetworkStore();

	const handleExport = async () => {
		setExportIconState('generating');
		console.log('🌐 Exporting network...');
		const exportedData = network.export().join('\n');
		console.log('📋 Exported Data:\n' + exportedData);
		await useClipboard(exportedData);
		setExportIconState('copied');

		setTimeout(() => {
			setExportIconState('');
		}, 2000);
	}

	return (
		<div className='absolute top-2 right-2 gap-2 flex'>
			<Button variant='outline' size='icon' onClick={handleExport}>
				{exportIconState === 'generating' ? <Spinner data-icon="inline-start" /> : ''}
				{exportIconState === 'copied' ? <ClipboardCheck /> : ''}
				{exportIconState === 'error' ? <ClipboardX /> : ''}
				{exportIconState === '' ? <Clipboard /> : ''}
			</Button>
		</div>
	)
}