import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useNetworkStore } from '~/store/network_store';
import { type ProjectSummary } from '~/types/project_summary';

type UseAutosaveOptions = {
	project: ProjectSummary | null;
	delay?: number;
};

const defaultDelay = 800;
const animationDuration = 100;

export function useAutosave({ project, delay = defaultDelay }: UseAutosaveOptions) {
	// const exportCode = useNetworkStore((state) => state.export().join('\n'));
	const exportCode = useNetworkStore((state) => state.export_cache.join('\n'));
	const [isSaving, setIsSaving] = useState(false);
	const lastSavedContentRef = useRef<string | null>(project?.content ?? null);
	const timeoutRef = useRef<number | null>(null);
	const requestInFlightRef = useRef(false);
	const pendingContentRef = useRef<string | null>(null);

	const flushPending = useCallback((nextProject: ProjectSummary | null) => {
		if (!nextProject)
			return;

		if (requestInFlightRef.current)
			return;

		const nextContent = pendingContentRef.current;
		if (!nextContent || nextContent === lastSavedContentRef.current)
			return;
		console.log('💾 Autosaving project...');

		requestInFlightRef.current = true;
		setIsSaving(true);

		router.put(`/projects/${nextProject.id}`, {
			name: nextProject.name,
			description: nextProject.description,
			visibility: nextProject.visibility,
			content: nextContent,
		}, {
			preserveScroll: true,
			preserveState: true,
			replace: true,
			headers: {
				'X-Autosave': 'true',
			},
			onSuccess: () => {
				lastSavedContentRef.current = nextContent;
				requestInFlightRef.current = false;
				setTimeout(() => {
					setIsSaving(false);
				}, animationDuration)

				if (pendingContentRef.current !== nextContent && pendingContentRef.current !== lastSavedContentRef.current)
					window.setTimeout(() => flushPending(nextProject), 0);
			},
			onError: () => {
				requestInFlightRef.current = false;
				setIsSaving(false);
			},
		});
	}, []);

	useEffect(() => {
		lastSavedContentRef.current = project?.content ?? null;
		pendingContentRef.current = null;
		setTimeout(() => {
			setIsSaving(false);
		}, animationDuration)

		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, [project?.content, project?.id]);

	useEffect(() => {
		if (!project)
			return;

		if (exportCode === lastSavedContentRef.current)
			return;

		pendingContentRef.current = exportCode;

		if (timeoutRef.current !== null)
			window.clearTimeout(timeoutRef.current);

		timeoutRef.current = window.setTimeout(() => {
			timeoutRef.current = null;
			flushPending(project);
		}, delay);

		return () => {
			if (timeoutRef.current !== null) {
				window.clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, [delay, exportCode, flushPending, project, project?.content]);

	const forceSave = useCallback(() => {
		if (!project)
			return;
		console.log('💾 Forcing save...');

		if (timeoutRef.current !== null) {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}

		pendingContentRef.current = exportCode;
		flushPending(project);
	}, [exportCode, flushPending, project]);

	return {
		forceSave,
		isSaving,
	};
}