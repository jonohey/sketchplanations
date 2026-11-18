import fs from "node:fs";
import path from "node:path";

let cachedCategoryNav = null;

export function getCategoryNavData() {
	if (cachedCategoryNav) return cachedCategoryNav;

	const filePath = path.join(process.cwd(), "data/category-nav.json");
	if (!fs.existsSync(filePath)) {
		return { categories: {}, recentUids: [] };
	}

	cachedCategoryNav = JSON.parse(fs.readFileSync(filePath, "utf8"));
	return cachedCategoryNav;
}
