import { kv } from "@vercel/kv";

import { sketchplanationUids } from "./fetchBuildCatalog.mjs";

const prismicToKV = async ({ sketchplanations } = {}) => {
	if (process.env.VERCEL !== "1") return;

	console.time("[prismicToKV]");
	console.log("[prismicToKV] Starting...");

	const uids = sketchplanationUids(sketchplanations);

	await kv.del("sketchplanations");
	await kv.sadd("sketchplanations", ...uids);

	console.timeEnd("[prismicToKV]");
};

export default prismicToKV;
