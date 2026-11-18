import { track } from "@vercel/analytics";

import { capturePostHogEvent } from "helpers/posthog";

export const EXPLAINER_KIT_PATH = "/explainer-kit";

export const EXPLAINER_KIT_PROMO = {
	heading: "Hand-drawn visuals for your presentations",
	body: "Ready-made illustrations and diagrams to help your ideas land in slides, lessons and workshops.",
	eyebrow: "New: the Sketchplanations Explainer Kit",
	features: [
		"250+ hand-drawn people, icons and metaphors",
		"Searchable library to copy or download from",
		"Commercial licence for slides, courses and client work",
		"One-time payment, no subscription",
	],
	cta: "Explore the Explainer Kit",
};

// Stable `placement` values: desktop_nav, mobile_nav, homepage,
// footer, about, about_intro, licence, card_sidebar, card_menu, footer_tile.
// Call from the `onClick` of a link to EXPLAINER_KIT_PATH.
export const trackExplainerKitClick = (placement) => {
	const sourcePath = window.location.pathname;
	track("Explainer-kit-link", { placement, source_path: sourcePath });
	capturePostHogEvent("explainer_kit_link_clicked", {
		placement,
		source_path: sourcePath,
	});
};
