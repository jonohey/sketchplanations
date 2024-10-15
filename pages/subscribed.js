import Page from "components/Page";
import { pageTitle } from "helpers";
import Head from "next/head";
import { client } from "services/prismic";

const Subscribed = ({ document }) => {
	return (
		<>
			<Head>
				<title>{pageTitle("Subscribed")}</title>
				<link rel="canonical" href="https://www.sketchplanations.com/subscribed" />
			</Head>
			<Page document={document} />
		</>
	);
};

export async function getStaticProps() {
	const document = await client.getSingle("subscribed");
	return { props: { document } };
}

export default Subscribed;
