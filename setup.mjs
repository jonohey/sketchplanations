import buildBooksIndex from "./utils/buildBooksIndex.mjs";
import buildInitialSearchResults from "./utils/buildInitialSearchResults.mjs";
import buildNewerSketchplanations from "./utils/buildNewerSketchplanations.mjs";
import buildPagesData from "./utils/buildPagesData.mjs";
import buildRss from "./utils/buildRss.mjs";
import buildSearchIndex from "./utils/buildSearchIndex.mjs";
import buildSitemap from "./utils/buildSitemap.mjs";
import buildSketchTooltipsData from "./utils/buildSketchTooltipsData.mjs";
import { fetchBuildCatalog } from "./utils/fetchBuildCatalog.mjs";
import prismicToKV from "./utils/prismicToKV.mjs";

const setup = async () => {
	const catalog = await fetchBuildCatalog();

	await Promise.all([
		buildBooksIndex(catalog),
		buildInitialSearchResults(catalog),
		buildSearchIndex(catalog),
		buildRss(catalog),
		buildSitemap(catalog),
		prismicToKV(catalog),
		buildNewerSketchplanations(catalog),
		buildPagesData(),
		buildSketchTooltipsData(catalog),
	]);
};

setup().catch((error) => {
	console.error("Error occurred while running build tasks:", error);
	process.exit(1);
});
