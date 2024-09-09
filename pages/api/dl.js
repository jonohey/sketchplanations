import fetch from "node-fetch";

import { client } from "services/prismic";

export default async (req, res) => {
	const uid = req.query.uid;
	const sketchplanation = await client.getByUID("sketchplanation", uid, {
		fetch: "sketchplanation.image",
	});

	const imageUrl = sketchplanation.data.image.url.split("?")[0];
	const extension = imageUrl.split(".").pop().toLowerCase();
	const filename = `sketchplanations-${uid}.${extension}`;

	res.setHeader("content-disposition", "attachment; filename=" + filename);
	res.setHeader("X-Robots-Tag", "noindex");

	try {
		const response = await fetch(imageUrl);
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		res.send(buffer);
	} catch (e) {
		res.status(404);
	}
};
