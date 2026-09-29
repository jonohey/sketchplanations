import fs from "node:fs";
import path from "node:path";

export function sketchTooltipEntries(sketchplanations) {
	return sketchplanations
		.map(({ uid, data: { image } }) => {
			try {
				return { uid, image };
			} catch (error) {
				console.error(error);
				return null;
			}
		})
		.filter(Boolean);
}

function buildSketchTooltipsData({ sketchplanations }) {
	console.time("[buildSketchTooltipsData]");
	console.log("[buildSketchTooltipsData] Starting...");

	const data = sketchTooltipEntries(sketchplanations);
	const filePath = path.join(process.cwd(), "data/sketch-tooltips-data.json");
	fs.writeFileSync(filePath, JSON.stringify(data));

	console.timeEnd("[buildSketchTooltipsData]");
}

export default buildSketchTooltipsData;
