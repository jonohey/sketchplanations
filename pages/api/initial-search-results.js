import fs from "node:fs";
import path from "node:path";

export default function handler(req, res) {
	const filePath = path.join(process.cwd(), "initial-search-results.json");
	const fileContents = fs.readFileSync(filePath, "utf8");

	res.status(200).json(JSON.parse(fileContents));
}
