import FancyLink from "components/FancyLink";
import { sort } from "fast-sort";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import useCookie from "react-use-cookie";
import styles from "./categories.module.css";

import SortButtons from "components/SortButtons";
import TextHeader from "components/TextHeader";
import { humanizeTag, pageTitle } from "helpers";
import { client } from "services/prismic";

const countOccurrences = (arr, val) =>
	arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

const Categories = ({ tagsByName, tagsByCount }) => {
	const [sort, setSort] = useState("count"); // Default value
	const [cookieSort, setCookieSort] = useCookie("tagsSort", "count");

	useEffect(() => {
		if (cookieSort) {
			setSort(cookieSort);
		}
	}, [cookieSort]);

	return (
		<>
			<Head>
				<title>{pageTitle("Categories")}</title>
				<meta
					name="description"
					content="Explore Sketchplanations by topic to discover clear, simple explanations on subjects like science, creativity, psychology, and more. Find sketches and illustrations that explain the topics you care about most."
				/>
				<link rel="canonical" href="https://www.sketchplanations.com/categories" />
			</Head>
			<div className="pt-6 px-6 text-center">
				<TextHeader>Categories</TextHeader>
				<p className="prose mx-auto mt-4 mb-8 max-w-2xl text-textSubdued">
					Browse topics to find clear, simple explanations through sketches and illustrations, covering a wide range of subjects from everyday concepts to complex ideas.
				</p>
			</div>
			<div className="text-center mt-8 mb-8">
				<FancyLink href="/search">Search</FancyLink>
				<span className="mx-2">·</span>
				<FancyLink href="/archive">Archive</FancyLink>
				<span className="mx-2">·</span>
				<FancyLink href="/list">List</FancyLink>
			</div>
			<div className="px-6 max-w-md mx-auto">
				<SortButtons
					value={sort}
					onChange={setCookieSort}
					options={[
						{ label: "Frequency", value: "count" },
						{ label: "A-Z", value: "name" },
					]}
				/>
			</div>
			{sort === "name" && (
				<div className={styles.tags}>
					{tagsByName.map(({ tag, slug, count }) => (
						<Link key={slug} href={`/categories/${slug}`}>
							{humanizeTag(tag)} <b>{count}</b>
						</Link>
					))}
				</div>
			)}
			{sort === "count" && (
				<div className={styles.tags}>
					{tagsByCount.map(({ tag, slug, count }) => (
						<Link key={slug} href={`/categories/${slug}`}>
							{humanizeTag(tag)} <b>{count}</b>
						</Link>
					))}
				</div>
			)}
		</>
	);
};

export async function getStaticProps() {
	const sketchplanations = await client.getAllByType("sketchplanation", {
		orderings: [
			{
				field: "my.sketchplanation.published_at",
				direction: "desc",
			},
		],
	});

	const tags = await client.getAllByType("tag", {
		orderings: [
			{
				field: "my.tag.identifier",
			},
		],
	});

	const tagsFromSketchplanations = sketchplanations
		.flatMap((sketchplanation) =>
			sketchplanation.data.tags.map((tag) => tag.tag.slug),
		)
		.filter((tag) => tag);

	const tagsByName = tags
		.map((tag) => {
			const identifier = tag.data.identifier;
			const slug = tag.slugs[0];
			return {
				tag: identifier,
				slug,
				count: countOccurrences(tagsFromSketchplanations, slug),
			};
		})
		.filter((tag) => tag.count > 0);

	const tagsByCount = sort(tagsByName).desc((tag) => tag.count);

	return { props: { tagsByName, tagsByCount } };
}

export default Categories;
