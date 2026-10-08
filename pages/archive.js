import FancyLink from "components/FancyLink";
import SketchplanationsGrid from "components/SketchplanationsGrid";
import TextHeader from "components/TextHeader";
import { pageTitle } from "helpers";
import {
	getHistoryEntryCache,
	setHistoryEntryCache,
} from "helpers/historyEntryCache";
import { LoaderCircle } from "lucide-react";
import Head from "next/head";
import { useState } from "react";
import { client } from "services/prismic";

const ITEMS_PER_PAGE = 40;
const HISTORY_CACHE_KEY = "archive";

const Archive = ({ initialSketchplanations }) => {
	// Going Back restores the sketches loaded so far, so scroll restoration has
	// the page height it needs; a fresh visit starts from the first page.
	const [restored] = useState(() => getHistoryEntryCache(HISTORY_CACHE_KEY));
	const [sketchplanations, setSketchplanations] = useState(
		restored?.sketchplanations ?? initialSketchplanations.results,
	);
	const [page, setPage] = useState(restored?.page ?? 1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(
		restored ? restored.hasMore : initialSketchplanations.next_page,
	);

	const loadMore = async () => {
		setLoading(true);
		const nextPage = page + 1;
		const newSketchplanations = await fetchSketchplanations(nextPage);
		const allSketchplanations = [
			...sketchplanations,
			...newSketchplanations.results,
		];
		setSketchplanations(allSketchplanations);
		setPage(nextPage);
		setLoading(false);
		setHasMore(newSketchplanations.next_page);
		setHistoryEntryCache(HISTORY_CACHE_KEY, {
			sketchplanations: allSketchplanations,
			page: nextPage,
			hasMore: newSketchplanations.next_page,
		});
	};

	return (
		<>
			<Head>
				<title>{pageTitle("Archive")}</title>
				<meta
					name="description"
					content="Browse the full visual archive of over a decade of Sketchplanations. Discover simple, clear sketches that explain complex ideas, and explore topics that inspire your curiosity."
				/>
				<link rel="canonical" href="https://sketchplanations.com/archive" />
			</Head>
			<div className="pt-6 px-6 text-center">
				<TextHeader>Archive</TextHeader>
				<p className="prose mx-auto mt-4 mb-8 max-w-2xl text-textSubdued">
					Explore the full visual archive of over a decade of Sketchplanations and discover sketches that interest and inspire you. Use them to have great conversations about ideas.
				</p>
			</div>
			<div className="text-center mt-8 mb-8">
				<FancyLink href="/search">Search</FancyLink>
				<span className="mx-2">·</span>
				<FancyLink href="/categories">Categories</FancyLink>
				<span className="mx-2">·</span>
				<FancyLink href="/list">List</FancyLink>
			</div>
			<SketchplanationsGrid prismicDocs={sketchplanations} />
			{hasMore && (
				<div className="pt-8 pb-12 px-6 flex flex-col gap-4 items-center justify-center">
					<p className="text-sm text-textSubdued">
						Showing {sketchplanations.length} sketchplanations
					</p>
					<button
						type="button"
						className="btn-primary w-full max-w-96"
						onClick={loadMore}
						disabled={loading}
					>
						{loading ? "Loading..." : "Load more"}
						{loading && <LoaderCircle className="animate-spin" size={16} />}
					</button>
				</div>
			)}
			<div className="text-center mt-2 mb-12">
				<FancyLink href="/search">Search</FancyLink>
				<span className="mx-2">·</span>
				<FancyLink href="/categories">Categories</FancyLink>
				<span className="mx-2">·</span>
				<FancyLink href="/list">List</FancyLink>
			</div>
		</>
	);
};

async function fetchSketchplanations(page = 1) {
	return client.getByType("sketchplanation", {
		orderings: [
			{
				field: "my.sketchplanation.published_at",
				direction: "desc",
			},
		],
		fetch: [
			'sketchplanation.title',
			'sketchplanation.image',
		],
		pageSize: ITEMS_PER_PAGE,
		page,
	});
}

export async function getStaticProps() {
	const initialSketchplanations = await fetchSketchplanations();

	return { props: { initialSketchplanations } };
}

export default Archive;
