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
					content="Discover 'Big Ideas, Little Pictures' by Jono Hey—a delightful book that simplifies complex ideas with clear illustrations. Explore reviews, FAQs, see what's inside, and find out how to order your copy."
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
