import fetch from "node-fetch";

import { client } from "services/prismic";

const sanitizeSlug = (slug) =>
	slug.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase();

export default async (req, res) => {
	const uid = req.query.uid;
	const format = req.query.format;
	const sketchplanation = await client.getByUID("sketchplanation", uid, {
		fetch: "sketchplanation.image",
	});

	const baseUrl = sketchplanation.data.image.url.split("?")[0];
	const extension = baseUrl.split(".").pop().toLowerCase();
	const safeSlug = sanitizeSlug(uid);

	let imageUrl, filename;

	if (format === "medium") {
		imageUrl = `${baseUrl}?auto=format,compress&fit=max&w=1920&h=1920`;
		filename = `sketchplanations-${safeSlug}.${extension}`;
	} else {
		imageUrl = baseUrl;
		filename = `sketchplanations-${safeSlug}-high-resolution.${extension}`;
	}

	res.setHeader("content-disposition", "attachment; filename=" + filename);
	res.setHeader("X-Robots-Tag", "noindex");

	try {
		const response = await fetch(imageUrl);
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		res.send(buffer);
	} catch (e) {
		console.error(e);
		res.status(404);
	}
};
