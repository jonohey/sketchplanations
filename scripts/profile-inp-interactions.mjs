#!/usr/bin/env node
/**
 * Lab INP profiling for sketchplanations.com.
 *
 * Measures click-to-paint latency (two rAF frames after click) on key interactions
 * with mobile emulation and optional CPU throttling. Field CrUX INP is the 75th
 * percentile of slowest interactions across real users — use this script to compare
 * before/after changes, not to match Search Console numbers exactly.
 *
 * Usage:
 *   npx puppeteer browsers install chrome
 *   node scripts/profile-inp-interactions.mjs
 *   node scripts/profile-inp-interactions.mjs --url /categories/weather --throttle 4
 */

let puppeteer;
try {
	puppeteer = (await import("puppeteer")).default;
} catch {
	console.error("Install puppeteer first: npx puppeteer browsers install chrome && pnpm add -D puppeteer");
	process.exit(1);
}

const DEFAULT_URL = "https://sketchplanations.com/the-chinese-zodiac";
const args = process.argv.slice(2);
const urlArg = args.find((arg) => arg.startsWith("--url="))?.split("=")[1];
const throttleArg = Number(args.find((arg) => arg.startsWith("--throttle="))?.split("=")[1] ?? 4);
const baseUrl = urlArg?.startsWith("http") ? urlArg : `https://sketchplanations.com${urlArg ?? "/the-chinese-zodiac"}`;

const SCENARIOS = [
	{ label: "hamburger-menu", selector: 'button[aria-label="Toggle navigation menu"]' },
	{ label: "search-button", selector: 'button[aria-label="Open search"]' },
	{ label: "lightbox-image", selector: "img.cursor-zoom-in", sketchOnly: true },
	{ label: "lightbox-close", selector: 'button[aria-label="Close"]', sketchOnly: true, after: "lightbox-image" },
	{ label: "category-card", selector: "a.group", categoryOnly: true },
];

async function measureTap(page, selector) {
	await page.evaluate(() => {
		window.__inpProfile = [];
	});
	await page.tap(selector);
	await new Promise((resolve) => setTimeout(resolve, 1000));
	return page.evaluate(() => window.__inpProfile);
}

async function main() {
	const browser = await puppeteer.launch({
		headless: "new",
		args: ["--no-sandbox"],
	});
	const page = await browser.newPage();
	const client = await page.createCDPSession();

	if (throttleArg > 1) {
		await client.send("Emulation.setCPUThrottlingRate", { rate: throttleArg });
	}

	await page.setViewport({
		width: 393,
		height: 851,
		deviceScaleFactor: 2.75,
		isMobile: true,
		hasTouch: true,
	});
	await page.evaluateOnNewDocument(() => {
		window.__inpProfile = [];
		document.addEventListener(
			"click",
			() => {
				const start = performance.now();
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						window.__inpProfile.push({
							raf2Ms: Math.round(performance.now() - start),
						});
					});
				});
			},
			true,
		);
	});

	console.log(`Profiling ${baseUrl} (CPU throttle: ${throttleArg}x)\n`);
	await page.goto(baseUrl, { waitUntil: "networkidle2", timeout: 90000 });
	await new Promise((resolve) => setTimeout(resolve, 2000));

	const pathname = new URL(baseUrl).pathname;
	const isCategoryPage = pathname.startsWith("/categories/");
	const isSketchPage = !isCategoryPage && pathname.split("/").filter(Boolean).length === 1;

	for (const scenario of SCENARIOS) {
		if (scenario.sketchOnly && !isSketchPage && !baseUrl.match(/sketchplanations\.com\/[^/]+$/)) {
			continue;
		}
		if (scenario.categoryOnly && !isCategoryPage) {
			continue;
		}

		try {
			const results = await measureTap(page, scenario.selector);
			const maxRaf2 = Math.max(...results.map((r) => r.raf2Ms), 0);
			const status = maxRaf2 >= 200 ? "FAIL" : maxRaf2 >= 100 ? "WARN" : "OK";
			console.log(`${status.padEnd(5)} ${scenario.label.padEnd(18)} max-raf2=${maxRaf2}ms`);

			if (scenario.label === "search-button" && page.url().includes("/search")) {
				await page.goto(baseUrl, { waitUntil: "networkidle2", timeout: 90000 });
				await new Promise((resolve) => setTimeout(resolve, 1500));
			}
		} catch (error) {
			console.log(`SKIP  ${scenario.label.padEnd(18)} ${error.message}`);
		}
	}

	console.log("\nInterpretation:");
	console.log("- INP 'good' threshold is 200ms in Search Console.");
	console.log("- max-raf2 approximates click → paint on a throttled device.");
	console.log("- If lightbox-image is FAIL but others are OK, focus fixes on SketchplanationImage.");

	await browser.close();
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
