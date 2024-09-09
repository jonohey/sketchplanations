import Head from "next/head";

import { Page } from "components";
import { pageTitle } from "helpers";
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
