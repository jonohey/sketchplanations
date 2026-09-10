import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (relativePath) =>
	readFileSync(new URL(`../../${relativePath}`, import.meta.url), "utf8");

describe("mobile INP first-pass changes", () => {
	it("defers cookie consent and the coffee button from the app shell", () => {
		const app = read("pages/_app.js");

		expect(app).toContain("runWhenIdle");
		expect(app).toContain("loadCookieConsent");
		expect(app).toContain('import("vanilla-cookieconsent/dist/cookieconsent.css")');
		expect(app).toContain('import("vanilla-cookieconsent.css")');
		expect(app.indexOf('import("vanilla-cookieconsent/dist/cookieconsent.css")')).toBeLessThan(
			app.indexOf('import("vanilla-cookieconsent.css")'),
		);
		expect(app).toContain("ssr: false");
		expect(app).not.toMatch(/import \* as CookieConsent from ["']vanilla-cookieconsent["']/);
		expect(app).not.toMatch(/^import ["']vanilla-cookieconsent/);
	});

	it("scopes cookie consent dark theme to prefers-color-scheme: dark", () => {
		const theme = read("vanilla-cookieconsent.css");

		expect(theme).toContain("prefers-color-scheme: dark");
		expect(theme).not.toMatch(/^:root\s*\{/);
	});

	it("loads Swiper CSS on the client instead of blocking the initial render", () => {
		const stack = read("components/SketchplanationsStack.js");
		const tagged = read("components/TaggedSketchplanations.js");
		const stackCss = read("components/SketchplanationsStack.module.css");
		const swiperStyles = read("helpers/loadSwiperStyles.js");

		expect(stack).toContain("loadSwiperStyles");
		expect(tagged).toContain("loadSwiperStyles");
		expect(stack).not.toContain("swiper/css");
		expect(tagged).not.toContain("swiper/css");
		expect(swiperStyles).toContain('import("swiper/css")');
		expect(stackCss).toContain(":global(.swiper-slide-shadow)");
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

	it("does not load rough-notation in the global header, footer, sketch CTAs, or title", () => {
		expect(read("components/Navigation.js")).not.toContain("react-rough-notation");
		expect(read("components/Footer.js")).not.toContain("react-rough-notation");
		expect(read("components/SketchplanationCtas.js")).not.toContain("react-rough-notation");
		expect(read("components/TextHeader.js")).not.toContain("react-rough-notation");
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

	it("keeps the lightbox code-split and avoids sync layout reads on open", () => {
		const image = read("components/SketchplanationImage.js");
		const lightbox = read("components/SketchplanationLightbox.js");

		expect(image).not.toContain("addEventListener(\"scroll\"");
		expect(image).not.toContain("willChange");
		expect(image).not.toContain("framer-motion");
		expect(image).toContain("ResizeObserver");
		expect(image).toContain('import("components/SketchplanationLightbox")');
		expect(image).toContain("runWhenIdle(() => track(\"lightbox_open\"");
		expect(lightbox).toContain("max-width: 767px");
		expect(lightbox).toContain("styles.mobileRoot");
		expect(lightbox).not.toContain("framer-motion");
	});

	it("code-splits below-the-fold sketch carousels", () => {
		const page = read("pages/[uid].js");

		expect(page).toContain('dynamic(() => import("components/SketchplanationsStack")');
		expect(page).toContain('dynamic(() => import("components/TaggedSketchplanations")');
		expect(page.match(/ssr:\s*false/g)?.length).toBeGreaterThanOrEqual(2);
	});
});
