import buildInitialSearchResults from "./utils/buildInitialSearchResults.mjs";
import buildNewerSketchplanations from "./utils/buildNewerSketchplanations.mjs";
import buildPagesData from "./utils/buildPagesData.mjs";
import buildRss from "./utils/buildRss.mjs";
import buildSitemap from "./utils/buildSitemap.mjs";
import buildSketchTooltipsData from "./utils/buildSketchTooltipsData.mjs";
import prismicToKV from "./utils/prismicToKV.mjs";

const setup = async () => {
	await Promise.all([
		buildInitialSearchResults(),
		buildRss(),
		buildSitemap(),
		prismicToKV(),
		buildNewerSketchplanations(),
		buildPagesData(),
		buildSketchTooltipsData(),
	]).catch((error) => {
		console.error("Error occurred while running build tasks:", error);
	});
};

setup();
