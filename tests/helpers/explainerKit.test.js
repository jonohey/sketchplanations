import { beforeEach, describe, expect, it, vi } from "vitest";

import { trackExplainerKitClick } from "helpers/explainerKit";

const { track, capturePostHogEvent } = vi.hoisted(() => ({
	track: vi.fn(),
	capturePostHogEvent: vi.fn(),
}));

vi.mock("@vercel/analytics", () => ({ track }));
vi.mock("helpers/posthog", () => ({ capturePostHogEvent }));

describe("trackExplainerKitClick", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubGlobal("window", { location: { pathname: "/the-overview-effect" } });
	});

	it("sends one event per tool with the placement and source page", () => {
		trackExplainerKitClick("card_sidebar");

		const properties = {
			placement: "card_sidebar",
			source_path: "/the-overview-effect",
		};
		expect(track).toHaveBeenCalledTimes(1);
		expect(track).toHaveBeenCalledWith("Explainer-kit-link", properties);
		expect(capturePostHogEvent).toHaveBeenCalledTimes(1);
		expect(capturePostHogEvent).toHaveBeenCalledWith(
			"explainer_kit_link_clicked",
			properties,
		);
	});
});
