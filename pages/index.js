import dynamic from "next/dynamic";
import Head from "next/head";

import styles from "./index.module.css";

import Pagination from "components/Pagination";
import SubscribeInline from "components/SubscribeInline";

import { client } from "services/prismic";

const Sketchplanation = dynamic(() => import("../components/Sketchplanation"));

const Home = ({ sketchplanations, subscribeInlineDoc }) => {
	return (
		<>
			<Head>
				<meta
					name="description"
					content="Sketchplanations explains the world one sketch at a time. Discover clear, simple sketches that break down ideas from science, creativity, psychology, and more. Explore recent sketches, search for topics, and share your favourites. Start here."
				/>
			</Head>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="prose lg:prose-xl mx-auto text-center">
					<h1>
						Explaining the world one sketch at a time
					</h1>
					<p className="lead">
						Sketchplanations makes complex ideas simple with clear, insightful sketches. Explore topics from science, creativity, psychology, and beyond explained in pictures.
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="max-w-xl mx-auto text-center">
					<SubscribeInline doc={subscribeInlineDoc} />
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-12 sm:mt-16 lg:mt-20">
				<h2 className="prose prose-xl mx-auto text-center">Recent sketches</h2>
			</div>

			<div className={styles.sketchplanations}>
				{sketchplanations.results.map((sketchplanation, index) => (
					<Sketchplanation
						key={sketchplanation.uid}
						sketchplanation={sketchplanation}
						priority={index === 0}
					/>
				))}
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 my-12">
				<Pagination
					key={sketchplanations.page}
					currentPage={sketchplanations.page}
					totalPages={sketchplanations.total_pages}
				/>
			</div>
		</>
	);
};

export const getServerSideProps = async ({ query }) => {
	const [sketchplanations, subscribeInlineDoc] = await Promise.all([
		client.getByType("sketchplanation", {
			orderings: [{ field: "my.sketchplanation.published_at", direction: "desc" }],
			pageSize: 6,
			page: query.page || 1,
		}),
		client.getSingle("subscribe_inline")
	]);

	return { props: { sketchplanations, subscribeInlineDoc } };
};

export default Home;
