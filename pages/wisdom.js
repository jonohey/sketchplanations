import Page from "components/Page";
import { pageTitle } from "helpers";
import Head from "next/head";
import { client } from "services/prismic";

const Wisdom = ({ document }) => {
	return (
		<>
			<Head>
				<title>{pageTitle("Wisdom")}</title>
				<meta
					name="description"
					content="A collection of wise words and quotes to live by"
				/>
				<link rel="canonical" href="https://sketchplanations.com/wisdom" />
			</Head>
			<Page document={document} />
		</>
	);
};

export async function getStaticProps() {
	const document = await client.getSingle("wisdom");
	return { props: { document } };
}

export default Wisdom;
