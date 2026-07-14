import * as Sentry from "@sentry/nextjs";

Sentry.init({
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	enabled: process.env.NODE_ENV === "production",
	// Sample performance traces lightly in production to control volume/cost
	tracesSampleRate: 0.1,
});
