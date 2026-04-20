import * as prismic from "@prismicio/client";

import { client } from "services/prismic";

/**
 * Resolves a tag document from a URL slug (same rules as pages/categories/[tag].js).
 */
export async function getTagDocumentBySlug(slug) {
	const tagIdentifer = slug.replace(/-/g, " ");
	let tagDocs = await client.get({
		filters: [prismic.filter.at("my.tag.identifier", tagIdentifer)],
		pageSize: 1,
	});

	if (tagDocs.total_results_size === 0) {
		tagDocs = await client.get({
			filters: [prismic.filter.at("my.tag.identifier", slug)],
			pageSize: 1,
		});
	}

	return tagDocs?.results?.[0] ?? null;
}
