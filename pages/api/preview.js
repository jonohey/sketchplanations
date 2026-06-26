import { createClient } from "@prismicio/client";
import { redirectToPreviewURL, setPreviewData } from "@prismicio/next/pages";

export default async (req, res) => {
	const client = createClient({ req });

	await setPreviewData({ req, res });

	await redirectToPreviewURL({ req, res, client });
};
