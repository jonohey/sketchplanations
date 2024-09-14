import * as prismic from "@prismicio/client";
import { client } from "services/prismic";

// Fisher-Yates shuffle algorithm
const shuffle = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

export default async function handler(req, res) {
	const { tags, excludeUid } = req.query;

	if (!tags) {
		return res.status(400).json({ error: "Missing tags" });
	}

	const taggedSketchplanations = await Promise.all(
		JSON.parse(tags).map(async (tag) => {
			const taggedSketches = await client.getAllByType("sketchplanation", {
				filters: [
					prismic.filter.at("my.sketchplanation.tags.tag", tag.tag.id),
					excludeUid
						? prismic.filter.not("my.sketchplanation.uid", excludeUid)
						: null,
				].filter(Boolean),
			});

			if (taggedSketches.length === 0) return null;

			return {
				tag: tag.tag,
				sketchplanations: shuffle(taggedSketches),
			};
		}),
	);

	const filteredTaggedSketchplanations = taggedSketchplanations.filter(Boolean);

	res.status(200).json(shuffle(filteredTaggedSketchplanations));
}
