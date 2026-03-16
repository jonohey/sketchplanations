import { describe, expect, it } from "vitest";
import shouldIgnoreShortcut from "../../helpers/shouldIgnoreShortcut";

const makeEvent = (overrides = {}) => ({
	repeat: false,
	ctrlKey: false,
	metaKey: false,
	altKey: false,
	shiftKey: false,
	target: { tagName: "DIV", isContentEditable: false },
	...overrides,
});

describe("shouldIgnoreShortcut", () => {
	it("returns false for a plain key press", () => {
		expect(shouldIgnoreShortcut(makeEvent())).toBe(false);
	});

	it("returns true when ctrlKey is held", () => {
		expect(shouldIgnoreShortcut(makeEvent({ ctrlKey: true }))).toBe(true);
	});

	it("returns true when metaKey (Cmd) is held", () => {
		expect(shouldIgnoreShortcut(makeEvent({ metaKey: true }))).toBe(true);
	});

	it("returns true when altKey is held", () => {
		expect(shouldIgnoreShortcut(makeEvent({ altKey: true }))).toBe(true);
	});

	it("returns false when only shiftKey is held", () => {
		expect(shouldIgnoreShortcut(makeEvent({ shiftKey: true }))).toBe(false);
	});

	it("returns true for repeated keydown events", () => {
		expect(shouldIgnoreShortcut(makeEvent({ repeat: true }))).toBe(true);
	});

	it("returns true when target is an INPUT", () => {
		expect(
			shouldIgnoreShortcut(makeEvent({ target: { tagName: "INPUT" } })),
		).toBe(true);
	});

	it("returns true when target is a TEXTAREA", () => {
		expect(
			shouldIgnoreShortcut(makeEvent({ target: { tagName: "TEXTAREA" } })),
		).toBe(true);
	});

	it("returns true when target is a SELECT", () => {
		expect(
			shouldIgnoreShortcut(makeEvent({ target: { tagName: "SELECT" } })),
		).toBe(true);
	});

	it("returns true when target is contentEditable", () => {
		expect(
			shouldIgnoreShortcut(
				makeEvent({ target: { tagName: "DIV", isContentEditable: true } }),
			),
		).toBe(true);
	});

	it("returns false when target is a non-input element", () => {
		expect(
			shouldIgnoreShortcut(makeEvent({ target: { tagName: "BUTTON" } })),
		).toBe(false);
	});

	it("handles missing target gracefully", () => {
		expect(shouldIgnoreShortcut(makeEvent({ target: null }))).toBe(false);
	});
});
