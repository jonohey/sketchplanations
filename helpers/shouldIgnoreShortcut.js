export default function shouldIgnoreShortcut(e) {
	if (e.repeat) return true;
	if (e.ctrlKey || e.metaKey || e.altKey) return true;

	const tag = e.target?.tagName;
	if (
		tag === "INPUT" ||
		tag === "TEXTAREA" ||
		tag === "SELECT" ||
		e.target?.isContentEditable
	) {
		return true;
	}

	return false;
}
