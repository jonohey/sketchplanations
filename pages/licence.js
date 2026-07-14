import LicenceContent from "components/LicenceContent";
import { pageTitle } from "helpers";
import Head from "next/head";
import { client } from "services/prismic";

const Licence = ({ document }) => {
	return (
		<>
			<Head>
				<title>{pageTitle("Licence")}</title>
				<meta
					name="description"
					content="How to share and use Sketchplanations considerately — including in books, articles, and presentations. Follow the licence terms to help more people find the sketches they love."
				/>
				<link rel="canonical" href="https://sketchplanations.com/licence" />
			</Head>
			<LicenceContent document={document} />
		</>
	);
};

export async function getStaticProps() {
	const document = await client.getSingle("licence");
	return { props: { document } };
}

export default Licence;
