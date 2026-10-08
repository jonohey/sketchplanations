// In-memory state remembered per browser history entry, so going Back to a page
// can restore what the visitor had built up (e.g. archive "Load more" clicks)
// while a fresh visit to the same page starts clean. Next.js keeps `key` on
// history.state and preserves it across router.replace.
const entries = new Map();

const entryKey = (name) => {
	if (typeof window === "undefined") return null;

	const key = window.history.state?.key;

	return key ? `${name}:${key}` : null;
};

export const getHistoryEntryCache = (name) => {
	const key = entryKey(name);

	return key ? entries.get(key) : undefined;
};

export const setHistoryEntryCache = (name, value) => {
	const key = entryKey(name);

	if (key) entries.set(key, value);
};
