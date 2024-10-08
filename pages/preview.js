import { useRouter } from "next/router";
import { useEffect } from "react";

import { client, linkResolver } from "services/prismic";

const Preview = ({ token }) => {
	const router = useRouter();

	useEffect(() => {
		client
			.previewSession(token, linkResolver, "/")
			.then((url) => router.push(url));
	});

	return null;
};

export async function getServerSideProps({ query: { token, documentId } }) {
	return { token, documentId };
}

export default Preview;
