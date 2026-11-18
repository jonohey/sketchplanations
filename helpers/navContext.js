import { humanizeTag } from "helpers";
import { resolveSketchTagDocs } from "helpers/structuredData";

const STORAGE_KEY = "sketchplanations:nav-context";
const CHANGE_EVENT = "sketchplanations:nav-context-change";
const RETURN_TARGET_KEY = "sketchplanations:nav-return-target";
const LIGHTBOX_CONTINUITY_KEY = "sketchplanations:nav-keep-lightbox";
const TRANSIENT_TTL_MS = 15_000;

export function resolveNavContext(context, uid) {
	if (!context || !Array.isArray(context.uids) || !uid) return null;

	const { uids, loop } = context;
	const index = uids.indexOf(uid);
	if (index === -1) return null;

	const total = uids.length;
	const wrap = (i) => uids[(i + total) % total];
	const previous =
		index > 0 ? uids[index - 1] : loop && total > 1 ? wrap(index - 1) : null;
	const next =
		index < total - 1
			? uids[index + 1]
			: loop && total > 1
				? wrap(index + 1)
				: null;

	return {
		previous,
		next,
		position: index + 1,
		total,
	};
}

function isNavContext(value) {
	if (typeof value !== "object" || value === null) return false;
	return (
		typeof value.label === "string" &&
		value.label.length > 0 &&
		typeof value.href === "string" &&
		/^\/(?!\/)/.test(value.href) &&
		typeof value.loop === "boolean" &&
		Array.isArray(value.uids) &&
		value.uids.every((s) => typeof s === "string") &&
		(value.lastViewedUid === undefined ||
			typeof value.lastViewedUid === "string")
	);
}

export function parseNavContext(raw) {
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		return isNavContext(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

function notifyNavContextChange() {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function saveNavContext(context) {
	if (typeof window === "undefined") return;
	try {
		if (context) {
			window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
		} else {
			window.sessionStorage.removeItem(STORAGE_KEY);
		}
	} catch {
		// Private mode or blocked storage: navigation falls back to the sketch's category.
	}
	notifyNavContextChange();
}

export function readNavContextRaw() {
	if (typeof window === "undefined") return null;
	try {
		return window.sessionStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}
}

export function subscribeNavContext(onChange) {
	if (typeof window === "undefined") return () => {};
	window.addEventListener(CHANGE_EVENT, onChange);
	return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

export function markReturnToUid(uid) {
	if (typeof window === "undefined" || !uid) return;
	try {
		window.sessionStorage.setItem(
			RETURN_TARGET_KEY,
			JSON.stringify({ uid, at: Date.now() }),
		);
	} catch {}
}

export function peekReturnToUid() {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.sessionStorage.getItem(RETURN_TARGET_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (
			typeof parsed?.uid !== "string" ||
			typeof parsed?.at !== "number" ||
			Date.now() - parsed.at > TRANSIENT_TTL_MS
		) {
			window.sessionStorage.removeItem(RETURN_TARGET_KEY);
			return null;
		}
		return parsed.uid;
	} catch {
		return null;
	}
}

export function clearReturnToUid() {
	if (typeof window === "undefined") return;
	try {
		window.sessionStorage.removeItem(RETURN_TARGET_KEY);
	} catch {}
}

export function markKeepLightboxOpen() {
	if (typeof window === "undefined") return;
	try {
		window.sessionStorage.setItem(LIGHTBOX_CONTINUITY_KEY, String(Date.now()));
	} catch {}
}

export function consumeKeepLightboxOpen() {
	if (typeof window === "undefined") return false;
	try {
		const raw = window.sessionStorage.getItem(LIGHTBOX_CONTINUITY_KEY);
		if (!raw) return false;
		window.sessionStorage.removeItem(LIGHTBOX_CONTINUITY_KEY);
		const at = Number(raw);
		return Number.isFinite(at) && Date.now() - at <= TRANSIENT_TTL_MS;
	} catch {
		return false;
	}
}

export function categoryNavContext({ slug, label }, uids) {
	return {
		label,
		href: `/categories/${slug}`,
		uids,
		loop: true,
	};
}

export function searchNavContext(query, uids) {
	const trimmed = String(query ?? "").trim();
	return {
		label: `Search: \u201c${trimmed}\u201d`,
		href: `/search?${new URLSearchParams({ q: trimmed }).toString()}`,
		uids,
		loop: false,
	};
}

export function recentNavContext(
	uids,
	{ label = "Recent", href = "/archive" } = {},
) {
	return {
		label,
		href,
		uids,
		loop: false,
	};
}

export function listNavContext(sortMethod, uids) {
	return {
		label: sortMethod === "recent" ? "List (by date)" : "List (A\u2013Z)",
		href: "/list",
		uids,
		loop: false,
	};
}

export function buildFallbackNavContext({ uid, tags, categoryNav }) {
	if (!uid || !categoryNav) return null;

	const validTags = resolveSketchTagDocs(tags);
	for (const tag of validTags) {
		const slug = (tag.uid || tag.slug || "").trim();
		const categoryUids = categoryNav.categories?.[slug];
		if (Array.isArray(categoryUids) && categoryUids.includes(uid)) {
			return categoryNavContext(
				{ slug, label: humanizeTag(slug) },
				categoryUids,
			);
		}
	}

	if (
		Array.isArray(categoryNav.recentUids) &&
		categoryNav.recentUids.includes(uid)
	) {
		return recentNavContext(categoryNav.recentUids, {
			label: "Archive",
			href: "/archive",
		});
	}

	return null;
}
