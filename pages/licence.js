import Page from "components/Page";
import { pageTitle } from "helpers";
import Head from "next/head";
import { client } from "services/prismic";

const Licence = ({ document }) => {
	return (
		<>
			<Head>
				<title>{pageTitle("Licence")}</title>
			</Head>
			<meta
				name="description"
				content="How to share and use Sketchplanations considerately. Follow the license terms to help more people find and enjoy the sketches they love."
			/>
			<Page document={document} />
		</>
	);
};

export async function getStaticProps() {
	const document = await client.getSingle("licence");
	return { props: { document } };
}

export default Licence;
