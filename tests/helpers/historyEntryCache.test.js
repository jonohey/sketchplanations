import { afterEach, describe, expect, it, vi } from "vitest";

import {
	getHistoryEntryCache,
	setHistoryEntryCache,
} from "../../helpers/historyEntryCache";

const stubHistoryKey = (key) => {
	vi.stubGlobal("window", { history: { state: key ? { key } : null } });
};

describe("historyEntryCache", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("returns what was stored for the same history entry", () => {
		stubHistoryKey("entry-a");
		setHistoryEntryCache("archive", { page: 3 });

		expect(getHistoryEntryCache("archive")).toEqual({ page: 3 });
	});

	it("starts clean for a different history entry", () => {
		stubHistoryKey("entry-b");
		setHistoryEntryCache("archive", { page: 3 });

		stubHistoryKey("entry-c");

		expect(getHistoryEntryCache("archive")).toBeUndefined();
	});

	it("keeps separate names apart", () => {
		stubHistoryKey("entry-d");
		setHistoryEntryCache("archive", { page: 2 });

		expect(getHistoryEntryCache("other")).toBeUndefined();
	});

	it("does nothing without a history key or window", () => {
		stubHistoryKey(null);
		setHistoryEntryCache("archive", { page: 2 });
		expect(getHistoryEntryCache("archive")).toBeUndefined();

		vi.unstubAllGlobals();
		expect(getHistoryEntryCache("archive")).toBeUndefined();
	});
});
