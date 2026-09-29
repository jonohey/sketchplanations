import { afterEach, describe, expect, it, vi } from "vitest";
import runWhenIdle from "../../helpers/runWhenIdle";

describe("runWhenIdle", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it("uses requestIdleCallback when available and cancels on cleanup", () => {
		const cancelIdleCallback = vi.fn();
		const requestIdleCallback = vi.fn(() => 42);
		vi.stubGlobal("requestIdleCallback", requestIdleCallback);
		vi.stubGlobal("cancelIdleCallback", cancelIdleCallback);

		const callback = vi.fn();
		const cancel = runWhenIdle(callback, { timeout: 1000 });

		expect(requestIdleCallback).toHaveBeenCalledTimes(1);
		expect(requestIdleCallback.mock.calls[0][1]).toEqual({ timeout: 1000 });
		expect(callback).not.toHaveBeenCalled();

		requestIdleCallback.mock.calls[0][0]();
		expect(callback).toHaveBeenCalledTimes(1);

		cancel();
		expect(cancelIdleCallback).toHaveBeenCalledWith(42);
	});

	it("falls back to setTimeout when requestIdleCallback is missing", () => {
		vi.stubGlobal("requestIdleCallback", undefined);
		const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout").mockReturnValue(7);
		const clearTimeoutSpy = vi
			.spyOn(globalThis, "clearTimeout")
			.mockImplementation(() => {});

		const callback = vi.fn();
		const cancel = runWhenIdle(callback);

		expect(setTimeoutSpy).toHaveBeenCalledWith(callback, 1);
		cancel();
		expect(clearTimeoutSpy).toHaveBeenCalledWith(7);
	});
});
