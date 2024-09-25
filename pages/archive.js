import FancyLink from "components/FancyLink";
import SketchplanationsGrid from "components/SketchplanationsGrid";
import TextHeader from "components/TextHeader";
import { pageTitle } from "helpers";
import { LoaderCircle } from "lucide-react";
import Head from "next/head";
import { useState } from "react";
import { client } from "services/prismic";

const ITEMS_PER_PAGE = 40;

const Archive = ({ initialSketchplanations }) => {
	const [sketchplanations, setSketchplanations] = useState(
		initialSketchplanations.results,
	);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialSketchplanations.next_page);

	const loadMore = async () => {
		setLoading(true);
		const nextPage = page + 1;
		const newSketchplanations = await fetchSketchplanations(nextPage);
		setSketchplanations([...sketchplanations, ...newSketchplanations.results]);
		setPage(nextPage);
		setLoading(false);
		setHasMore(newSketchplanations.next_page);
	};

	return (
		<>
			<Head>
				<title>{pageTitle("Archive")}</title>
				<meta
					name="description"
					content="The full scrollable archive of Sketchplanations. Happy scrolling!"
				/>
			</Head>
			<div className="pt-6 px-6 text-center">
				<TextHeader>Archive</TextHeader>
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
					<div className="w-full max-w-96 flex flex-col gap-3 px-6 items-center justify-center">
						<div className=" text-sm text-textSubdued">
							Showing {sketchplanations.length} of{" "}
							{initialSketchplanations.total_results_size} sketchplanations
						</div>
						<div className="w-full h-0.5 bg-bgDarker">
							<div
								className="h-full bg-white"
								style={{
									width: `${(sketchplanations.length / initialSketchplanations.total_results_size) * 100}%`,
								}}
							/>
						</div>
					</div>
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
		pageSize: ITEMS_PER_PAGE,
		page,
	});
}

export async function getStaticProps() {
	const initialSketchplanations = await fetchSketchplanations();

	return { props: { initialSketchplanations } };
}

export default Archive;
