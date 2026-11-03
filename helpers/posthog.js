import posthog from "posthog-js";

export const capturePostHogEvent = (event, properties) => {
	if (
		process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
		process.env.NEXT_PUBLIC_POSTHOG_HOST
	) {
		posthog.capture(event, properties);
	}
};

// Capturing is opted out by default; the cookie banner opts visitors in.
export const setPostHogConsent = (analyticsAccepted) => {
	if (!posthog.__loaded) return;

	if (analyticsAccepted) {
		posthog.opt_in_capturing();
	} else {
		posthog.opt_out_capturing();
	}
};
