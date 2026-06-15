import fs from "node:fs";
import path from "node:path";

export default function handler(req, res) {
	const filePath = path.join(process.cwd(), "data/search-index.json");
	const fileContents = fs.readFileSync(filePath, "utf8");

	// The file is already JSON, so send it as-is rather than parsing and
	// re-serializing ~1.7MB on every cache miss.
	res.setHeader("Content-Type", "application/json");
	res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
	res.status(200).send(fileContents);
}
