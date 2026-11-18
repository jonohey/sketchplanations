import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
	categoryNavContext,
	chronologicalNeighbours,
	clearReturnToUid,
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

describe("chronologicalNeighbours", () => {
	const recentUids = ["newest", "middle", "oldest"];

	it("resolves newer and older neighbours without wrapping", () => {
		expect(chronologicalNeighbours(recentUids, "newest")).toEqual({
			newerUid: null,
			olderUid: "middle",
			found: true,
		});
		expect(chronologicalNeighbours(recentUids, "middle")).toEqual({
			newerUid: "newest",
			olderUid: "oldest",
			found: true,
		});
		expect(chronologicalNeighbours(recentUids, "oldest")).toEqual({
			newerUid: "middle",
			olderUid: null,
			found: true,
		});
	});

	it("reports found: false when the uid is missing", () => {
		expect(chronologicalNeighbours(recentUids, "draft-sketch")).toEqual({
			newerUid: null,
			olderUid: null,
			found: false,
		});
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

	it("tracks and expires return-to-card targets", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-11-18T12:00:00Z"));

		markReturnToUid("the-abilene-paradox");
		expect(peekReturnToUid()).toBe("the-abilene-paradox");

		clearReturnToUid();
		expect(peekReturnToUid()).toBeNull();

		markReturnToUid("coastline-paradox");
		vi.advanceTimersByTime(20_000);
		expect(peekReturnToUid()).toBeNull();
	});
});
