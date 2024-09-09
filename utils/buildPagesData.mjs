import fs from "node:fs";
import path from "node:path";
import { globby } from "globby";

async function buildPagesData() {
	console.time("[buildPagesData]");
	console.log("[buildPagesData] Starting...");

	async function getUids() {
		const uids = await globby([
			"pages/**/*.js",
			"!pages/_*.js",
			"!pages/**/[uid].js",
			"!pages/**/[tag].js",
			"!pages/404.js",
			"!pages/500.js",
			"!pages/index.js",
			"!pages/preview.js",
			"!pages/subscribed.js",
			"!pages/thanks.js",
			"!pages/api/**/*.js",
		]);

		return uids.map((page) => {
			const path = page.replace("pages/", "").replace(".js", "");
			return path;
		});
	}

	const uids = await getUids();

	const filePath = path.join(process.cwd(), "pages.json");
	fs.writeFileSync(filePath, JSON.stringify(uids));

	console.timeEnd("[buildPagesData]");
}

export default buildPagesData;
