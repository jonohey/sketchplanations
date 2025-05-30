import Page from "components/Page";
import { pageTitle } from "helpers";
import Head from "next/head";
import { client } from "services/prismic";

const Thanks = ({ document }) => {
	return (
		<>
			<Head>
				<title>{pageTitle("Thanks")}</title>
				<meta
					name="description"
					content="Sketchplanations exists thanks to the generous patrons and followers who support me making them"
				/>
				<link rel="canonical" href="https://sketchplanations.com/thanks" />
			</Head>
			<Page document={document} />
		</>
	);
};

export async function getStaticProps() {
	const document = await client.getSingle("thanks");
	return { props: { document } };
}

export default Thanks;
