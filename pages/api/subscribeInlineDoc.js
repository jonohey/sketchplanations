import { client } from "services/prismic";

export default async function handler(req, res) {
	const subscribeInlineDoc = await client.getSingle("subscribe_inline");
	res.status(200).json(subscribeInlineDoc);
}
