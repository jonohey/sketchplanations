import postgres from "postgres";

import { client } from "../services/prismic.mjs";

const sql = postgres({
	ssl: {
		rejectUnauthorized: true,
		require: true,
	},
});

const prismicToNeon = async () => {
	if (process.env.VERCEL !== "1") return;

	console.time("[prismicToNeon]");
	console.log("[prismicToNeon] Starting...");

	const docs = await client.getAllByType("sketchplanation", {
		fetch: [
			"sketchplanation.id",
			"sketchplanation.uid",
			"sketchplanation.title",
		],
	});

	const sketchplanations = docs.map(({ id, uid, data: { title } }) => ({
		id,
		handle: uid,
		title,
	}));

	await sql`INSERT INTO sketchplanations ${sql(
		sketchplanations,
	)} ON CONFLICT (id) DO UPDATE SET handle = EXCLUDED.handle, title = EXCLUDED.title`;

	console.timeEnd("[prismicToNeon]");
};

export default prismicToNeon;
