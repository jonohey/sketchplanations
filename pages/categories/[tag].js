import * as prismic from "@prismicio/client";
import SketchplanationsGrid from "components/SketchplanationsGrid";
import TextHeader from "components/TextHeader";
import { humanizeTag, pageTitle } from "helpers";
import Head from "next/head";
import { useRouter } from "next/router";
import { client } from "services/prismic";

import styles from "./[tag].module.css";

const Tag = ({ tag, sketchplanations }) => {
	const router = useRouter();

	if (router.isFallback) {
		return <div>Loading…</div>;
	}

	return (
		<>
			<Head>
				<title>{pageTitle(`Category: ${tag}`)}</title>
				<meta
					name="description"
					content={`Sketchplanations from the ${tag} category`}
				/>
			</Head>
			<div className={styles.root}>
				<TextHeader className={styles.header}>
					Category: <b>{tag}</b>
				</TextHeader>
				<SketchplanationsGrid prismicDocs={sketchplanations} />
			</div>
		</>
	);
};

export async function getStaticPaths() {
	const tags = await client.getAllByType("tag");
	const tagPaths = tags.map((tag) => ({ params: { tag: tag.slugs[0] } }));

	return {
		paths: tagPaths,
		fallback: true,
	};
}

export async function getStaticProps({ params: { tag } }) {
	const tagIdentifer = tag.replace(/-/g, " ");
	let tagDocs = await client.get({
		filters: [prismic.filter.at("my.tag.identifier", tagIdentifer)],
		pageSize: 1,
	});

	// The tag probably has a - in it
	if (tagDocs.total_results_size === 0) {
		tagDocs = await client.get({
			filters: [prismic.filter.at("my.tag.identifier", tag)],
			pageSize: 1,
		});
	}

	const tagDoc = tagDocs?.results[0];

	if (!tagDoc) return { notFound: true };

	const sketchplanations = await client.dangerouslyGetAll({
		filters: [
			prismic.filter.at("document.type", "sketchplanation"),
			prismic.filter.at("my.sketchplanation.tags.tag", tagDoc.id),
		],
		orderings: [
			{
				field: "my.sketchplanation.published_at",
				direction: "desc",
			},
		],
	});

	return { props: { tag: humanizeTag(tagDoc.slugs[0]), sketchplanations } };
}

export default Tag;
