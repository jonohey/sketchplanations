import fs from "node:fs";
import path from "node:path";

export default function handler(req, res) {
	const filePath = path.join(process.cwd(), "data/search-index.json");
	const fileContents = fs.readFileSync(filePath, "utf8");

	res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
	res.status(200).json(JSON.parse(fileContents));
}
