export default function runWhenIdle(callback, { timeout = 2500 } = {}) {
	if (typeof window === "undefined") return () => {};

	if (typeof window.requestIdleCallback === "function") {
		const id = window.requestIdleCallback(() => callback(), { timeout });
		return () => window.cancelIdleCallback(id);
	}

	const id = window.setTimeout(callback, 1);
	return () => window.clearTimeout(id);
}
