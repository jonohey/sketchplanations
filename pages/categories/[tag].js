import * as prismic from "@prismicio/client";
import SketchplanationsGrid from "components/SketchplanationsGrid";
import TextHeader from "components/TextHeader";
import { humanizeTag, pageTitle } from "helpers";
import { ChevronRight } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
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
				<title>{pageTitle(`${tag} sketches`)}</title>
				<meta
					name="description"
					content={`Discover sketches, drawings, illustrations, and pictures that explain key ideas related to ${tag}. Explore visual explanations that make understanding the topic of ${tag} simple.`}
				/>
				<link rel="canonical" href={`https://sketchplanations.com/categories/${router.query.tag}`} />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "BreadcrumbList",
							"itemListElement": [
								{
									"@type": "ListItem",
									"position": 1,
									"name": "Home",
									"item": "https://sketchplanations.com/"
								},
								{
									"@type": "ListItem",
									"position": 2,
									"name": "Categories",
									"item": "https://sketchplanations.com/categories"
								},{
									"@type": "ListItem",
									"position": 3,
									"name": `${tag}`,
									"item": `https://sketchplanations.com/categories/${router.query.tag}`
								},
							],
						}),
					}}
				/>
			</Head>
			<div className={styles.root} key={tag}>
				<nav className="text-sm mb-4 px-6">
					<div className="flex items-center">
						<Link href="/" className="text-blue-600 hover:underline">Home</Link>
						<ChevronRight className="mx-1" size={16} />
						<Link href="/categories" className="text-blue-600 hover:underline">Categories</Link>
						<ChevronRight className="mx-1" size={16} />
						<span className="text-gray-600 dark:text-gray-300">{tag}</span>
					</div>
				</nav>
				<div className="pt-2 px-6 text-center">
					<TextHeader className={styles.header}>{tag} sketches</TextHeader>
					<p className="prose mx-auto mt-2 sm:mt-3 mb-8 max-w-2xl text-textSubdued">
						Explore sketches, drawings, and illustrations that simplify ideas related to {tag}.
						<span className="hidden md:inline">
							{" "}Discover the frameworks, principles, and tips I&apos;ve sketched to make {tag} topics easy to understand and share.
						</span>
					</p>
				</div>
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
		fetch: [
			'sketchplanation.title',
			'sketchplanation.image',
		]
	});

	return { 
		props: { 
			tag: humanizeTag(tagDoc.uid), 
			sketchplanations: sketchplanations.map(({ id, uid, data }) => ({
				id,
				uid,
				data: {
					title: data.title,
					image: data.image
				}
			}))
		} 
	};
}

export default Tag;
