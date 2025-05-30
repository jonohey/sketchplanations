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

const BarItem = ({ tag, slug, count, maxCount }) => (
	<Link href={`/categories/${slug}`} className="block">
		<div className="flex items-center group hover:cursor-pointer">
			<div className="w-32 relative h-6 flex items-center">
				<div className="absolute right-4 text-sm text-textSubdued group-hover:text-text group-hover:font-semibold transition-colors duration-100 truncate max-w-[120px] sm:max-w-none">
					{humanizeTag(tag)}
				</div>
			</div>
			<div className="flex-1 relative h-6">
				<div
					className="h-full bg-blueLight group-hover:bg-blue absolute left-0 top-0 rounded-sm transition-all duration-300 origin-left group-hover:scale-x-[1.02] group-hover:-translate-y-[1px]"
					style={{
						width: `${Math.round((count / maxCount) * 90)}%`,
					}}
				/>
				<span 
					className="absolute top-1/2 -translate-y-1/2 text-sm text-textSubduedMore group-hover:text-text transition-all duration-300 group-hover:translate-x-2 ml-2"
					style={{
						left: `${Math.round((count / maxCount) * 90)}%`
					}}
				>
					{count}
				</span>
			</div>
		</div>
	</Link>
);

const Categories = ({ tagsByName, tagsByCount }) => {
	const [sort, setSort] = useState("chart");
	const [cookieSort, setCookieSort] = useCookie("tagsSort", "chart");
	const [showMore, setShowMore] = useState(false);
	const maxCount = Math.max(...tagsByCount.map(tag => tag.count));

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
				<link rel="canonical" href="https://sketchplanations.com/categories" />
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
						{ label: "Chart", value: "chart" },
						{ label: "Frequency", value: "count" },
						{ label: "A-Z", value: "name" },
					]}
				/>
			</div>

			{sort === "chart" && (
				<div className="p-6 pb-20">
					<div className="space-y-2 max-w-4xl mx-auto sm:max-w-2xl">
						{tagsByCount
							.filter(({ count }) => count >= 10)
							.map((tag) => (
								<BarItem key={tag.tag} {...tag} maxCount={maxCount} />
							))}

						{!showMore && (
							<button 
								onClick={() => setShowMore(true)}
								className="w-full text-center mt-4 mb-2 text-blue hover:text-text transition-colors duration-100"
							>
								See {(() => {
									const count = tagsByCount.filter(tag => tag.count < 10).length;
									if (count < 100) return count;
									return `${Math.floor(count/100)*100}+`;
								})()} more categories
							</button>
						)}

						{showMore && tagsByCount
							.filter(({ count }) => count < 10)
							.map((tag) => (
								<BarItem key={tag.tag} {...tag} maxCount={maxCount} />
							))}
					</div>
				</div>
			)}

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
