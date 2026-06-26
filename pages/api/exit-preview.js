import { exitPreview } from "@prismicio/next/pages";

export async function handler(req, res) {
	return await exitPreview({ req, res });
}
