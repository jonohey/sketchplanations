import { useEffect } from "react";

import { clearReturnToUid, peekReturnToUid } from "helpers/navContext";

const escapeSelectorValue = (value) => {
	if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
		return CSS.escape(value);
	}
	return String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
};

export default function useRestoreNavReturnTarget(deps = []) {
	useEffect(() => {
		const targetUid = peekReturnToUid();
		if (!targetUid) return undefined;

		const el = document.querySelector(
			`[data-sketch-uid="${escapeSelectorValue(targetUid)}"]`,
		);
		if (!el) return undefined;

		clearReturnToUid();

		const frame = window.requestAnimationFrame(() => {
			el.scrollIntoView({ block: "center", inline: "nearest" });
			el.setAttribute("data-nav-returned", "true");
		});

		const timer = window.setTimeout(() => {
			el.removeAttribute("data-nav-returned");
		}, 2200);

		return () => {
			window.cancelAnimationFrame(frame);
			window.clearTimeout(timer);
		};
		// biome-ignore lint/correctness/useExhaustiveDependencies: callers pass dynamic list deps explicitly
	}, deps);
}
