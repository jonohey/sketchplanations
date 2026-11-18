import { describe, expect, it } from "vitest";

import { detectSwipe } from "../../helpers/swipe";

describe("detectSwipe", () => {
	it("detects left and right swipes past the threshold", () => {
		expect(detectSwipe({ deltaX: -80, deltaY: 8 })).toBe("left");
		expect(detectSwipe({ deltaX: 80, deltaY: -8 })).toBe("right");
	});

	it("ignores taps and short drags below the threshold", () => {
		expect(detectSwipe({ deltaX: -25, deltaY: 0 })).toBeNull();
		expect(detectSwipe({ deltaX: 35, deltaY: 2 })).toBeNull();
	});

	it("ignores predominantly vertical scroll gestures", () => {
		expect(detectSwipe({ deltaX: -70, deltaY: 95 })).toBeNull();
		expect(detectSwipe({ deltaX: 60, deltaY: -60 })).toBeNull();
	});

	it("respects a custom threshold", () => {
		expect(detectSwipe({ deltaX: 30, deltaY: 0, threshold: 25 })).toBe("right");
		expect(detectSwipe({ deltaX: 30, deltaY: 0, threshold: 40 })).toBeNull();
	});
});
