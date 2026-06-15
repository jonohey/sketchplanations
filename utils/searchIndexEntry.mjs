import * as prismicH from "@prismicio/helpers";

import { normalizeForSearch } from "./searchNormalize.mjs";

export const sketchToIndexEntry = (sketch, tagById) => {
	const {
		id,
		uid,
		data: { title, body, image, tags = [], published_at: publishedAt },
	} = sketch;

	const categories = tags
		.map(({ tag }) => tagById.get(tag?.id))
		.filter(Boolean)
		.map(({ identifier, slug }) => ({ identifier, slug }));

	const categoryNames = categories.map(({ identifier }) => identifier);
	const categorySlugs = categories.map(({ slug }) => slug);
	const bodyText = prismicH.asText(body) ?? "";
	const imageAlt = image?.alt ?? "";

	return {
		id,
		uid,
		title,
		titleNormalized: normalizeForSearch(title),
		body: bodyText,
		bodyNormalized: normalizeForSearch(bodyText),
		imageAlt,
		imageAltNormalized: normalizeForSearch(imageAlt),
		categories: categoryNames.join(" "),
		categoriesNormalized: normalizeForSearch(categoryNames.join(" ")),
		categorySlugs: categorySlugs.join(" "),
		tags: categoryNames.join(" "),
		tagsNormalized: normalizeForSearch(categoryNames.join(" ")),
		publishedAt,
		image,
	};
};

export const tagToIndexEntry = (tag) => {
	const identifier = tag.data.identifier;

	return {
		id: tag.id,
		identifier,
		slug: tag.slugs[0],
		identifierNormalized: normalizeForSearch(identifier),
		slugNormalized: normalizeForSearch(tag.slugs[0]),
	};
};
