import fs from "node:fs";
import path from "node:path";
import { client } from "../services/prismic.mjs";

async function buildSketchTooltipsData() {
	console.time("[buildSketchTooltipsData]");
	console.log("[buildSketchTooltipsData] Starting...");

	const sketchplanations = await client.getAllByType("sketchplanation", {
		fetch: ["sketchplanation.uid", "sketchplanation.image"],
	});

	const data = sketchplanations
		.map(({ uid, data }) => {
			try {
				const { alt, url, dimensions } = data.image;

				return { uid, alt, url, dimensions };
			} catch (error) {
				console.error(error);
				return null;
			}
		})
		.filter(Boolean);

	const filePath = path.join(process.cwd(), "data/sketch-tooltips-data.json");
	fs.writeFileSync(filePath, JSON.stringify(data));

	console.timeEnd("[buildSketchTooltipsData]");
}

export default buildSketchTooltipsData;
