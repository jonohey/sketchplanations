import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

import styles from "./abode.module.css";

import { client } from "services/prismic";
import SubscribeInline from "components/SubscribeInline";
import FancyLink from "components/FancyLink";
import { ChevronRight } from "lucide-react";
// import Pagination from "components/Pagination";

const Sketchplanation = dynamic(() => import("../components/Sketchplanation"));

const Home = ({ sketchplanations, subscribeInlineDoc }) => {
	return (
		<>
			<Head>
				<meta
					name="description"
					content="Explaining the world one sketch at a time — each sketch explains an idea or concept. Explore, search and share. Start here."
				/>
			</Head>
			<div className={styles.masthead}>
				<p className={styles.slogan}>
					Explaining the world one sketch at a time
				</p>
			</div>

			<div className={styles.root}>
				<div className={styles.sketchplanation}>
					<Sketchplanation
						sketchplanation={sketchplanations[0]}
						priority={true}
					/>
				</div>
				<div className={styles.section}>
					<div className="max-w-xl mx-auto text-center">
						<SubscribeInline doc={subscribeInlineDoc} />
					</div>
				</div>
				<div className={styles.section}>
					<div className="grid grid-cols-[62fr_auto_38fr] items-center gap-x-12">
						<div>
							<h2 className="text-3xl font-semibold mb-6">Hi, I’m Jono Hey</h2>
							<div className="prose">
								<p>
									In 2012 my sister bought me{" "}
									<FancyLink href="https://www.chroniclebooks.com/products/one-sketch-a-day">
										a book with a page every day
									</FancyLink>{" "}
									for a year for a sketch. I used it to practise my drawing.
									When I finished it I needed a new challenge. So I set myself
									the challenge of explaining something with a sketch — as
									explaining is a handy skill. Over 2013 -14 I posted one
									sketchplanation a day. Since then I switched to one per week,
									and the quality improved.
								</p>
								<FancyLink href="/about">Learn more about me</FancyLink>
							</div>
						</div>
						<div className="h-full w-px bg-border" />
						<div>
							<h2 className="mb-3 text-xl font-semibold">
								Browse the latest sketches
							</h2>
							<ul className="grid gap-y-1">
								{sketchplanations.slice(1).map((sketchplanation) => (
									<li key={sketchplanation.uid}>
										<FancyLink
											href={`/sketchplanations/${sketchplanation.uid}`}
										>
											{sketchplanation.data.title}
										</FancyLink>
									</li>
								))}
							</ul>
							<FancyLink
								href="/archive"
								className="inline-block text-textSubdued hover:text-blue mt-6"
							>
								<span className="inline-flex flex-row gap-x-1 items-center">
									View the archive
									<ChevronRight size={16} />
								</span>
							</FancyLink>
						</div>
					</div>
				</div>
			</div>

			{/* <div className={styles.sketchplanations}>
				{sketchplanations.results.map((sketchplanation, index) => (
					<Sketchplanation
						key={sketchplanation.uid}
						sketchplanation={sketchplanation}
						priority={index === 0}
					/>
				))}
			</div>

			<Pagination
				key={sketchplanations.page}
				className="mb-12"
				currentPage={sketchplanations.page}
				totalPages={sketchplanations.total_pages}
			/> */}
		</>
	);
};

// export const getStaticProps = async () => {
// 	const sketchplanations = await client.getByType("sketchplanation", {
// 		orderings: [
// 			{
// 				field: "my.sketchplanation.published_at",
// 				direction: "desc",
// 			},
// 		],
// 		pageSize: 4,
// 	});

// 	return { props: { sketchplanations } };
// };

export const getServerSideProps = async () => {
	const sketchplanations = (
		await client.getByType("sketchplanation", {
			orderings: [
				{
					field: "my.sketchplanation.published_at",
					direction: "desc",
				},
			],
			pageSize: 8,
		})
	).results;

	const subscribeInlineDoc = await client.getSingle("subscribe_inline");

	return { props: { sketchplanations, subscribeInlineDoc } };
};

export default Home;
