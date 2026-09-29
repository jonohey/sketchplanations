export default function runWhenIdle(callback, { timeout = 2500 } = {}) {
	if (typeof globalThis.requestIdleCallback === "function") {
		const id = globalThis.requestIdleCallback(() => callback(), { timeout });
		return () => globalThis.cancelIdleCallback(id);
	}

	const id = globalThis.setTimeout(callback, 1);
	return () => globalThis.clearTimeout(id);
}
