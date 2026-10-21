import * as prismicH from "@prismicio/helpers";
import fs from "node:fs";

import {
	RSS_ITEM_COUNT,
	newestSketchplanations,
	sortSketchplanationsByPublishedAtDesc,
	sortTagsByIdentifier,
} from "./fetchBuildCatalog.mjs";
import { sketchImageUrl } from "./sketchImage.mjs";

const SITE_URL = "https://sketchplanations.com";
const LICENCE_URL = "https://creativecommons.org/licenses/by-nc/4.0/";
const LICENCE_NAME = "CC BY-NC 4.0";
const SUMMARY_LENGTH = 200;

const SITE_DESCRIPTION =
	"Sketchplanations explains the world one sketch at a time: simple hand-drawn sketches, each with a short explanation, covering ideas from science, creativity, psychology, business and everyday life. Made by Jono Hey.";

const oneLine = (text) => text.replace(/\s+/g, " ").trim();

const summarise = (text, length = SUMMARY_LENGTH) => {
	const flat = oneLine(text);
	if (flat.length <= length) return flat;
	const cut = flat.slice(0, length);
	return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 1))}…`;
};

const attributionFor = (uid) =>
	`Image: Jono Hey, Sketchplanations (${SITE_URL}/${uid}), ${LICENCE_NAME}`;

export function agentCategoriesFromCatalog({ sketchplanations, tags }) {
	const counts = new Map();
	for (const sketch of sketchplanations) {
		for (const { tag } of sketch.data.tags ?? []) {
			if (tag?.id) counts.set(tag.id, (counts.get(tag.id) ?? 0) + 1);
		}
	}

	return sortTagsByIdentifier(tags).map((tag) => {
		const slug = tag.uid ?? tag.slugs?.[0];
		return {
			id: tag.id,
			slug,
			name: tag.data.identifier,
			url: `${SITE_URL}/categories/${slug}`,
			count: counts.get(tag.id) ?? 0,
		};
	});
}

export function agentSketchesFromCatalog(catalog) {
	const categoryById = new Map(
		agentCategoriesFromCatalog(catalog).map((category) => [
			category.id,
			category,
		]),
	);

	return sortSketchplanationsByPublishedAtDesc(catalog.sketchplanations).map(
		(sketch) => {
			const {
				uid,
				last_publication_date: updated,
				data: { title, body, image, published_at: published, tags = [] },
			} = sketch;

			return {
				uid,
				url: `${SITE_URL}/${uid}`,
				title,
				text: prismicH.asText(body, "\n\n") ?? "",
				published: published ?? null,
				updated: updated ?? null,
				imageUrl: sketchImageUrl(image),
				imageAlt: image?.alt ?? "",
				categories: tags
					.map(({ tag }) => categoryById.get(tag?.id))
					.filter(Boolean),
			};
		},
	);
}

export function sketchesJsonFromCatalog(catalog) {
	const categories = agentCategoriesFromCatalog(catalog);

	return {
		name: "Sketchplanations",
		description: SITE_DESCRIPTION,
		url: SITE_URL,
		creator: "Jono Hey",
		licence: {
			name: LICENCE_NAME,
			url: LICENCE_URL,
			attribution: `Image: Jono Hey, Sketchplanations (link to the sketch page), ${LICENCE_NAME}`,
			terms: `${SITE_URL}/licence`,
		},
		categories: categories.map(({ slug, name, url, count }) => ({
			slug,
			name,
			url,
			count,
		})),
		sketches: agentSketchesFromCatalog(catalog).map((sketch) => ({
			uid: sketch.uid,
			url: sketch.url,
			title: sketch.title,
			summary: summarise(sketch.text),
			published: sketch.published,
			updated: sketch.updated,
			image: { url: sketch.imageUrl, alt: sketch.imageAlt },
			categories: sketch.categories.map(({ slug }) => slug),
		})),
	};
}

export function llmsTxtFromCatalog(catalog) {
	const latest = newestSketchplanations(
		catalog.sketchplanations,
		RSS_ITEM_COUNT,
	).map(
		({ uid, data: { title, image } }) =>
			`- [${oneLine(title)}](${SITE_URL}/${uid}): image ${sketchImageUrl(image)}`,
	);

	return `# Sketchplanations

> ${SITE_DESCRIPTION}

Each sketch has its own page at ${SITE_URL}/{slug} with the drawing, a written explanation and a description of the image (alt text). Sketches are filed under categories such as science, psychology and creativity.

## Using the sketches

- Licence: ${LICENCE_NAME} (${LICENCE_URL}). Showing a sketch as an example, quoting its explanation, or summarising it is welcome, as long as you credit it and link to the sketch page.
- Suggested credit: "${attributionFor("{slug}")}", with the sketch page as the link.
- Please keep the Sketchplanations name on the image and do not remove the logo. If you adapt a sketch, say so and credit the original.
- Commercial use (books, selling, advertising) needs permission: ${SITE_URL}/licence
- Image URLs are listed below for the latest sketches, and for every sketch in ${SITE_URL}/sketches.json and ${SITE_URL}/llms-full.txt. Use those rather than the download endpoint.

## Find content

- [All sketches as JSON](${SITE_URL}/sketches.json): every sketch with title, summary, image URL, alt text, date and categories
- [All sketches as text](${SITE_URL}/llms-full.txt): the full explanation of every sketch
- [Search](${SITE_URL}/search?q=habits): search by topic, e.g. ?q=habits
- [Categories](${SITE_URL}/categories): browse by topic; each category lives at ${SITE_URL}/categories/{category}
- [Archive](${SITE_URL}/archive): every sketch, newest first
- [RSS feed](${SITE_URL}/rss.xml): the latest sketches

## Latest sketches

${latest.join("\n")}

## About

- [About Jono Hey and Sketchplanations](${SITE_URL}/about)
- [Big Ideas Little Pictures](${SITE_URL}/big-ideas-little-pictures): the book
- [Licence and attribution](${SITE_URL}/licence)
`;
}

export function llmsFullTxtFromCatalog(catalog) {
	const sketches = agentSketchesFromCatalog(catalog);

	const entries = sketches.map((sketch) => {
		const lines = [
			`## ${oneLine(sketch.title)}`,
			"",
			`URL: ${sketch.url}`,
			sketch.published ? `Published: ${sketch.published}` : null,
			sketch.categories.length > 0
				? `Categories: ${sketch.categories.map(({ name }) => name).join(", ")}`
				: null,
			sketch.imageUrl ? `Image: ${sketch.imageUrl}` : null,
			sketch.imageAlt ? `Image description: ${oneLine(sketch.imageAlt)}` : null,
			`Credit: ${attributionFor(sketch.uid)}`,
			"",
			sketch.text,
		];
		return lines.filter((line) => line !== null).join("\n");
	});

	return `# Sketchplanations: all sketches

> ${SITE_DESCRIPTION}

Licence: ${LICENCE_NAME} (${LICENCE_URL}). Credit the sketch and link to its page when you show or quote it. Terms: ${SITE_URL}/licence

${entries.join("\n\n")}
`;
}

function buildAgentFiles(catalog) {
	console.time("[buildAgentFiles]");
	console.log("[buildAgentFiles] Starting...");

	fs.writeFileSync("public/llms.txt", llmsTxtFromCatalog(catalog));
	fs.writeFileSync("public/llms-full.txt", llmsFullTxtFromCatalog(catalog));
	fs.writeFileSync(
		"public/sketches.json",
		JSON.stringify(sketchesJsonFromCatalog(catalog)),
	);

	console.timeEnd("[buildAgentFiles]");
}

export default buildAgentFiles;
