import { describe, expect, it } from "vitest";

import { humanizeTag } from "helpers";

describe("humanizeTag", () => {
	it("turns slugs into capitalised words", () => {
		expect(humanizeTag("big-ideas")).toBe("Big ideas");
		expect(humanizeTag("some_tag")).toBe("Some tag");
	});

	it("adds apostrophes to known contractions and capitalises AI", () => {
		expect(humanizeTag("dont-panic")).toBe(
			"Dont panic".replace("Dont", "Don't"),
		);
		expect(humanizeTag("ai")).toBe("AI");
	});
});
