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

export default function useActiveNavContext(uid) {
	const raw = useSyncExternalStore(
		subscribeNavContext,
		readNavContextRaw,
		getServerSnapshot,
	);

	const { context, resolution } = useMemo(() => {
		const stored = parseNavContext(raw);
		const storedResolution = stored && resolveNavContext(stored, uid);
		if (stored && storedResolution) {
			return {
				context: stored,
				resolution: storedResolution,
			};
		}

		return {
			context: null,
			resolution: null,
		};
	}, [raw, uid]);

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
		persistStep,
		prepareReturnToList,
	};
}
