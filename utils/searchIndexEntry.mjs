import * as prismicH from "@prismicio/helpers";

import { normalizeForSearch } from "./searchNormalize.mjs";

export const sketchToIndexEntry = (sketch, tagById) => {
	const {
		id,
		uid,
		data: { title, body, image, tags = [] },
	} = sketch;

	// In Prismic a sketch's categories and tags are the same linked "tag"
	// documents, so they are indexed once as a single `categories` field.
	const categoryText = tags
		.map(({ tag }) => tagById.get(tag?.id))
		.filter(Boolean)
		.map(({ identifier }) => identifier)
		.join(" ");

	const bodyText = prismicH.asText(body) ?? "";
	const imageAlt = image?.alt ?? "";

	// Fuse searches the raw fields below; only the title needs a normalized
	// copy for the exact/prefix ranking boost in fuseSearch.js.
	return {
		id,
		uid,
		title,
		titleNormalized: normalizeForSearch(title),
		body: bodyText,
		imageAlt,
		categories: categoryText,
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
