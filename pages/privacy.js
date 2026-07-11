import Page from "components/Page";
import { pageTitle } from "helpers";
import Head from "next/head";
import { client } from "services/prismic";

const Privacy = ({ document }) => {
	return (
		<>
			<Head>
				<title>{pageTitle("Privacy")}</title>
				<meta
					name="description"
					content="How Sketchplanations handles your data, cookies, and email if you subscribe. A short privacy note for the site."
				/>
				<link rel="canonical" href="https://sketchplanations.com/privacy" />
			</Head>
			<Page document={document} />
		</>
	);
};

export async function getStaticProps() {
	const document = await client.getSingle("privacy");
	return {
		props: {
			document,
		},
	};
}

export default Privacy;
