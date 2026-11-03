import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

import { sentryDataCollection } from "./sentryDataCollection";

if (
	process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
	process.env.NEXT_PUBLIC_POSTHOG_HOST
) {
	posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
		api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
		defaults: "2026-01-30",
		capture_exceptions: true,
		// Stay off until the visitor accepts analytics in the cookie banner.
		opt_out_capturing_by_default: true,
		// Only record session replays on production, not Vercel previews or localhost.
		disable_session_recording:
			window.location.hostname !== "sketchplanations.com",
	});
}

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	enabled: process.env.NODE_ENV === "production",
	tracesSampleRate: 0.1,
	dataCollection: sentryDataCollection,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
