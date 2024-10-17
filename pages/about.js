import Page from "components/Page";
import { pageTitle } from "helpers";
import Head from "next/head";
import { client } from "services/prismic";

const About = ({ document }) => {
	return (
		<>
			<Head>
				<title>{pageTitle("About")}</title>
				<meta
					name="description"
					content="Learn about the inspiration behind Sketchplanations, the process of creating weekly sketches, and how you can support the project."
				/>
				<link rel="canonical" href="https://sketchplanations.com/about" />
			</Head>
			<Page document={document} />
		</>
	);
};

export const getStaticProps = async () => {
	const document = await client.getSingle("about");
	return { props: { document } };
};

export default About;
