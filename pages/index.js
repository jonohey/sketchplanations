import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

import styles from "./index.module.css";

import { client } from "services/prismic";
import Pagination from "components/Pagination";

const Sketchplanation = dynamic(() => import("../components/Sketchplanation"));

const Home = ({ sketchplanations }) => {
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

			<div className={styles.sketchplanations}>
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
				className="mb-8"
				currentPage={sketchplanations.page}
				totalPages={sketchplanations.total_pages}
			/>
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

export const getServerSideProps = async (context) => {
	const page = context.query.page || 1;
	const sketchplanations = await client.getByType("sketchplanation", {
		pageSize: 6,
		page,
	});

	return { props: { sketchplanations } };
};

export default Home;
