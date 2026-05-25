import { useState, useCallback } from "react";


function useCopyToClipboard(resetDelay = 2000) {
	const [copied, setCopied] = useState(false);

	const copy = useCallback(async (text) => {
		await useClipboard(text);
		setCopied(true);
		setTimeout(() => setCopied(false), resetDelay);
	}, [resetDelay]);

	return { copied, copy };
}

async function useClipboard(text: string) {
	try {
		await navigator.clipboard.writeText(text);
	} catch {
		const el = document.createElement("textarea");
		el.value = text;
		el.style.cssText = "position:fixed;left:-9999px";
		document.body.appendChild(el);
		el.select();
		document.execCommand("copy");
		document.body.removeChild(el);
	}
}

export { useCopyToClipboard, useClipboard };