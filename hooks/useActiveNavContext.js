import { useCallback, useMemo, useSyncExternalStore } from "react";

import {
	markReturnToUid,
	parseNavContext,
	readNavContextRaw,
	resolveNavContext,
	saveNavContext,
	subscribeNavContext,
} from "helpers/navContext";

const getServerSnapshot = () => null;

export default function useActiveNavContext(uid, fallbackContext) {
	const raw = useSyncExternalStore(
		subscribeNavContext,
		readNavContextRaw,
		getServerSnapshot,
	);

	const { context, resolution, isStored } = useMemo(() => {
		const stored = parseNavContext(raw);
		const storedResolution = stored && resolveNavContext(stored, uid);
		if (stored && storedResolution) {
			return {
				context: stored,
				resolution: storedResolution,
				isStored: true,
			};
		}

		return {
			context: fallbackContext ?? null,
			resolution: fallbackContext
				? resolveNavContext(fallbackContext, uid)
				: null,
			isStored: false,
		};
	}, [raw, uid, fallbackContext]);

	const persistStep = useCallback(
		(targetUid) => {
			if (!context || !targetUid) return;
			saveNavContext({
				...context,
				lastViewedUid: targetUid,
			});
		},
		[context],
	);

	const prepareReturnToList = useCallback(() => {
		if (uid) markReturnToUid(uid);
	}, [uid]);

	return {
		context,
		resolution,
		isStored,
		persistStep,
		prepareReturnToList,
	};
}
