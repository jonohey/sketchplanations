import Page from "components/Page";
import { pageTitle } from "helpers";
import Head from "next/head";
import { client } from "services/prismic";

const Book = ({ document }) => {
	return (
		<>
			<Head>
				<title>{pageTitle("Big Ideas Little Pictures by Jono Hey")}</title>
				<meta
					name="description"
					content="Buy Big Ideas Little Pictures the book of sketchplanations by Jono Hey"
				/>
			</Head>
			<Page document={document} />
		</>
	);
};

export async function getStaticProps() {
	const document = await client.getSingle("book");
	return { props: { document } };
}

export default Book;
