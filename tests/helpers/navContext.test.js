import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	buildFallbackNavContext,
	categoryNavContext,
	clearReturnToUid,
	consumeKeepLightboxOpen,
	listNavContext,
	markKeepLightboxOpen,
	markReturnToUid,
	parseNavContext,
	peekReturnToUid,
	readNavContextRaw,
	resolveNavContext,
	saveNavContext,
	searchNavContext,
} from "../../helpers/navContext";

const createMemoryStorage = () => {
	const store = new Map();
	return {
		getItem: (key) => (store.has(key) ? store.get(key) : null),
		setItem: (key, value) => store.set(key, String(value)),
		removeItem: (key) => store.delete(key),
		clear: () => store.clear(),
	};
};

const stubBrowserWindow = () => {
	const listeners = new Map();
	const sessionStorage = createMemoryStorage();

	vi.stubGlobal("window", {
		sessionStorage,
		addEventListener: (type, fn) => {
			if (!listeners.has(type)) listeners.set(type, new Set());
			listeners.get(type).add(fn);
		},
		removeEventListener: (type, fn) => {
			listeners.get(type)?.delete(fn);
		},
		dispatchEvent: (event) => {
			for (const fn of listeners.get(event.type) ?? []) fn(event);
			return true;
		},
	});

	return { sessionStorage };
};

describe("resolveNavContext", () => {
	const looping = categoryNavContext({ slug: "paradox", label: "Paradox" }, [
		"alpha",
		"beta",
		"gamma",
	]);

	it("returns neighbours and a 1-based position", () => {
		expect(resolveNavContext(looping, "beta")).toEqual({
			previous: "alpha",
			next: "gamma",
			position: 2,
			total: 3,
		});
	});

	it("wraps at both ends when loop is true", () => {
		expect(resolveNavContext(looping, "alpha")).toEqual({
			previous: "gamma",
			next: "beta",
			position: 1,
			total: 3,
		});
		expect(resolveNavContext(looping, "gamma")).toEqual({
			previous: "beta",
			next: "alpha",
			position: 3,
			total: 3,
		});
	});

	it("stops at both ends when loop is false", () => {
		const search = searchNavContext("bias", ["alpha", "beta", "gamma"]);
		expect(resolveNavContext(search, "alpha")).toMatchObject({
			previous: null,
			next: "beta",
			position: 1,
			total: 3,
		});
		expect(resolveNavContext(search, "gamma")).toMatchObject({
			previous: "beta",
			next: null,
			position: 3,
			total: 3,
		});
	});

	it("disables previous and next for a single-item list even when looping", () => {
		const single = categoryNavContext({ slug: "solo", label: "Solo" }, [
			"only",
		]);
		expect(resolveNavContext(single, "only")).toEqual({
			previous: null,
			next: null,
			position: 1,
			total: 1,
		});
	});

	it("returns null when the uid is not in the context", () => {
		expect(resolveNavContext(looping, "other-sketch")).toBeNull();
	});
});

describe("parseNavContext and storage helpers", () => {
	beforeEach(() => {
		stubBrowserWindow();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it("round-trips valid contexts and clears on null", () => {
		const context = {
			...searchNavContext("decision making", ["a", "b"]),
			lastViewedUid: "b",
		};
		saveNavContext(context);
		expect(parseNavContext(readNavContextRaw())).toEqual(context);
		expect(context.href).toBe("/search?q=decision+making");
		expect(context.label).toBe("Search: \u201cdecision making\u201d");

		saveNavContext(null);
		expect(readNavContextRaw()).toBeNull();
	});

	it("rejects malformed shapes and external or protocol-relative hrefs", () => {
		const valid = categoryNavContext({ slug: "design", label: "Design" }, [
			"a",
		]);

		expect(parseNavContext(null)).toBeNull();
		expect(parseNavContext("{bad json")).toBeNull();
		expect(
			parseNavContext(JSON.stringify({ ...valid, uids: [123] })),
		).toBeNull();
		expect(
			parseNavContext(
				JSON.stringify({ ...valid, href: "https://evil.example/x" }),
			),
		).toBeNull();
		expect(
			parseNavContext(JSON.stringify({ ...valid, href: "//evil.example/x" })),
		).toBeNull();
	});

	it("tracks and expires return-to-card targets and lightbox continuity", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-11-18T12:00:00Z"));

		markReturnToUid("the-abilene-paradox");
		expect(peekReturnToUid()).toBe("the-abilene-paradox");

		clearReturnToUid();
		expect(peekReturnToUid()).toBeNull();

		markReturnToUid("coastline-paradox");
		vi.advanceTimersByTime(20_000);
		expect(peekReturnToUid()).toBeNull();

		markKeepLightboxOpen();
		expect(consumeKeepLightboxOpen()).toBe(true);
		expect(consumeKeepLightboxOpen()).toBe(false);
	});
});

describe("buildFallbackNavContext", () => {
	const categoryNav = {
		categories: {
			paradox: ["the-abilene-paradox", "coastline-paradox"],
			management: ["raci", "the-abilene-paradox"],
		},
		recentUids: [
			"raci",
			"the-abilene-paradox",
			"untagged-sketch",
			"coastline-paradox",
		],
	};

	it("uses the sketch's primary valid tag as the looping fallback", () => {
		const tags = [
			{ tag: { id: "t1", uid: "paradox", slug: "paradox" } },
			{ tag: { id: "t2", uid: "management", slug: "management" } },
		];

		expect(
			buildFallbackNavContext({
				uid: "the-abilene-paradox",
				tags,
				categoryNav,
			}),
		).toEqual({
			label: "Paradox",
			href: "/categories/paradox",
			uids: ["the-abilene-paradox", "coastline-paradox"],
			loop: true,
		});
	});

	it("falls back to Archive when a sketch has no valid tags", () => {
		expect(
			buildFallbackNavContext({
				uid: "untagged-sketch",
				tags: [],
				categoryNav,
			}),
		).toEqual({
			label: "Archive",
			href: "/archive",
			uids: categoryNav.recentUids,
			loop: false,
		});
	});

	it("formats list contexts for alphabetical and date sorts", () => {
		expect(listNavContext("alphabetical", ["a", "b"]).label).toBe(
			"List (A\u2013Z)",
		);
		expect(listNavContext("recent", ["a", "b"]).label).toBe("List (by date)");
	});
});
