import * as prismicH from "@prismicio/helpers";
import fs from "node:fs";
import { create } from "xmlbuilder2";

import { client } from "../services/prismic.mjs";

const pubDate = (date) => {
	const dateObj = new Date(date);

	const pieces = dateObj.toString().split(" ");
	const offsetTime = pieces[5].match(/[-+]\d{4}/);
	const offset = offsetTime ? offsetTime : pieces[5];
	const parts = [
		`${pieces[0]},`,
		pieces[2],
		pieces[1],
		pieces[3],
		pieces[4],
		offset,
	];

	return parts.join(" ");
};

async function buildRss() {
	console.time("[buildRss]");
	console.log("[buildRss] Starting...");

	const sketchplanations = await client.getByType("sketchplanation", {
		fetch: [
			"sketchplanation.uid",
			"sketchplanation.title",
			"sketchplanation.image",
			"sketchplanation.body",
			"sketchplanation.published_at",
		],
		orderings: [
			{
				field: "my.sketchplanation.published_at",
				direction: "desc",
			},
		],
		pageSize: 20
	});

	const items = sketchplanations.results.map(
		({
			uid,
			data: {
				title,
				body,
				published_at,
				image: { url: image_url },
			},
		}) => {
			const url = `https://sketchplanations.com/${uid}`;
			const escapedImageUrl = image_url.replace(/&/g, '&amp;');
			const html = `<img src="${escapedImageUrl}&amp;w=798" />${prismicH.asHTML(body)}`;

			return {
				guid: url,
				title,
				pubDate: pubDate(published_at),
				link: url,
				description: {
					$: html
				},
			};
		},
	);

	const obj = {
		rss: {
			"@version": "2.0",
			"@xmlns:atom": "http://www.w3.org/2005/Atom",
			channel: {
				"atom:link": {
					"@href": "https://sketchplanations.com/rss.xml",
					"@rel": "self",
					"@type": "application/rss+xml",
				},
				title: "Sketchplanations",
				link: "https://sketchplanations.com/",
				description: "Explaining the world one sketch at a time",
				item: items,
			},
		},
	};

	const doc = create({ encoding: "UTF-8" }, obj);
	const xml = doc.end();
	fs.writeFileSync("public/rss.xml", xml);

	console.timeEnd("[buildRss]");
}

export default buildRss;
