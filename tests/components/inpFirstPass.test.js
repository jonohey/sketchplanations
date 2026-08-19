import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (relativePath) =>
	readFileSync(new URL(`../../${relativePath}`, import.meta.url), "utf8");

describe("mobile INP first-pass changes", () => {
	it("defers cookie consent and the coffee button from the app shell", () => {
		const app = read("pages/_app.js");

		expect(app).toContain("runWhenIdle");
		expect(app).toContain('import("vanilla-cookieconsent")');
		expect(app).toContain("ssr: false");
		expect(app).not.toMatch(/import \* as CookieConsent from ["']vanilla-cookieconsent["']/);
		expect(app).not.toContain('import "swiper.css"');
	});

	it("keeps the header free of framer-motion and skips the blur stack on mobile", () => {
		const header = read("components/Header.js");
		const headerCss = read("components/Header.module.css");

		expect(header).not.toContain("framer-motion");
		expect(header).toContain("root--hidden");
		expect(header).toContain("min-width: 768px");
		expect(headerCss).toContain(".root--hidden");
		expect(headerCss).toContain("prefers-reduced-motion");
	});

	it("does not load rough-notation in the global header, footer, or sketch CTAs", () => {
		expect(read("components/Navigation.js")).not.toContain("react-rough-notation");
		expect(read("components/Footer.js")).not.toContain("react-rough-notation");
		expect(read("components/SketchplanationCtas.js")).not.toContain("react-rough-notation");
		expect(read("components/Footer.js")).toContain("styles.feedbackLink");
		expect(read("components/SketchplanationCtas.js")).toContain("ctaListen");
	});

	it("shows the coffee button with CSS and a passive scroll listener", () => {
		const coffee = read("components/BuyMeACoffee.js");

		expect(coffee).not.toContain("framer-motion");
		expect(coffee).not.toContain("useScroll");
		expect(coffee).toContain("{ passive: true }");
		expect(coffee).toContain("styles.coffeeVisible");
	});

	it("does not load the Substack embed until it is near the viewport", () => {
		const subscribe = read("components/SubscribeInline.js");

		expect(subscribe).toContain("useInView");
		expect(subscribe).toContain("loading=\"lazy\"");
		expect(subscribe).toContain("inView");
		expect(subscribe).toContain("placeholder");
	});

	it("avoids measuring the sketch image on scroll and keeps the lightbox unmounted until open", () => {
		const image = read("components/SketchplanationImage.js");

		expect(image).not.toContain("addEventListener(\"scroll\"");
		expect(image).not.toContain("willChange");
		expect(image).toContain("(isOpen || isOpening || isClosing) &&");
		expect(image).toContain("getInitialImageDimensions()");
	});

	it("code-splits below-the-fold sketch carousels", () => {
		const page = read("pages/[uid].js");

		expect(page).toContain('dynamic(() => import("components/SketchplanationsStack")');
		expect(page).toContain('dynamic(() => import("components/TaggedSketchplanations")');
		expect(page).toContain("ssr: false");
	});
});
