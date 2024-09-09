import { searchSketchplanations } from "helpers";

const ALLOWED_REFERRER = process.env.ALLOWED_REFERRER; // Store your allowed referrer in an environment variable

export default async function autosuggestHandler(req, res) {
	const referer = req.headers.referer;

	if (!referer || !referer.startsWith(ALLOWED_REFERRER)) {
		return res.status(403).json({ message: "Forbidden" });
	}

	try {
		const { query } = req.query;

		const docs = await searchSketchplanations(query, { limit: 7 });

		const results = docs.map((result) => ({
			title: result.data.title,
			uid: result.uid,
		}));

		res.status(200).json({ results });
	} catch (error) {
		res.status(500).json({ results: [] });
	}
}
