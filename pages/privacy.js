import Page from "components/Page";
import { client } from "services/prismic";

const Privacy = ({ document }) => {
	return <Page document={document} />;
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
