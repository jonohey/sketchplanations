import { createClient } from "@prismicio/client";
import { redirectToPreviewURL, setPreviewData } from "@prismicio/next";

export default async (req, res) => {
	const client = createClient({ req });

	await setPreviewData({ req, res });

	await redirectToPreviewURL({ req, res, client });
};
