import FancyLink from "components/FancyLink";
import SortButtons from "components/SortButtons";
import TextHeader from "components/TextHeader";
import { pageTitle } from "helpers";
import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from 'react';
import { client } from "services/prismic";

const SketchList = ({ initialSketches }) => {
	const [sortMethod, setSortMethod] = useState('alphabetical');

	const sortedSketches = useMemo(() => {
		if (!Array.isArray(initialSketches) || initialSketches.length === 0) {
			return [];
		}

		if (sortMethod === 'recent') {
			return [...initialSketches].sort((a, b) => 
				new Date(b.data.published_at) - new Date(a.data.published_at)
			);
		} else {
			return [...initialSketches].sort((a, b) => 
				a.data.title.localeCompare(b.data.title)
			);
		}
	}, [initialSketches, sortMethod]);

	const groupedSketches = useMemo(() => {
		if (!Array.isArray(initialSketches) || initialSketches.length === 0) {
			return {};
		}

		if (sortMethod === 'alphabetical') {
			const groups = {};
			sortedSketches.forEach(sketch => {
				const firstLetter = sketch.data.title[0].toUpperCase();
				if (!groups[firstLetter]) groups[firstLetter] = [];
				groups[firstLetter].push(sketch);
			});
			return groups;
		} else {
			const groups = {};
			sortedSketches.forEach(sketch => {
				const year = new Date(sketch.data.published_at).getFullYear();
				if (!groups[year]) groups[year] = [];
				groups[year].push(sketch);
			});
			return groups;
		}
	}, [sortedSketches, sortMethod]);

	const groupKeys = useMemo(() => {
		if (sortMethod === 'alphabetical') {
			return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
		} else {
			return Object.keys(groupedSketches).sort((a, b) => b - a);
		}
	}, [groupedSketches, sortMethod]);

	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	return (
		<>
			<Head>
				<title>{pageTitle("List of sketchplanations")}</title>
				<meta
					name="description"
					content="Browse the full list of all Sketchplanations, organized A-Z or by date. Explore titles that span over a decade of sketches, offering clear and simple explanations on a wide range of topics."
				/>
				<link rel="canonical" href="https://sketchplanations.com/list" />
			</Head>
			<div className="max-w-7xl mx-auto px-5 py-6">
				<div className="pt-6 px-6 text-center">
					<TextHeader>List of sketchplanations</TextHeader>
          <p className="prose mx-auto mt-4 mb-8 max-w-2xl text-textSubdued">
            Explore the complete list of all Sketchplanations, organized by title or date.
          </p>
				</div>
				<div className="text-center mt-8 mb-8">
					<FancyLink href="/search">Search</FancyLink>
					<span className="mx-2">·</span>
					<FancyLink href="/categories">Categories</FancyLink>
					<span className="mx-2">·</span>
					<FancyLink href="/archive">Archive</FancyLink>
				</div>
				<div className="px-6 max-w-md mx-auto mb-6">
					<SortButtons
						value={sortMethod}
						onChange={setSortMethod}
						options={[
							{ label: "A-Z", value: "alphabetical" },
							{ label: "Date", value: "recent" },
						]}
					/>
				</div>
				{sortMethod === 'alphabetical' && (
					<div id="top" className="flex flex-wrap justify-center gap-2 mb-6 scroll-mt-24">
						{alphabet.map(letter => (
							groupedSketches[letter] ? (
								<a key={letter} href={`#${letter}`} className="text-blue hover:underline">
									{letter}
								</a>
							) : (
								<span key={letter} className="text-gray-400">
									{letter}
								</span>
							)
						))}
					</div>
				)}

				{groupKeys.map(key => (
					groupedSketches[key] && (
						<div key={key} className="mb-12">
							<h2 id={key} className="text-5xl font-bold mb-4 scroll-mt-24">{key}</h2>
							<div className="columns-1 sm:columns-2 lg:columns-3 gap-x-10">
								{groupedSketches[key].map(sketch => (
									<Link key={sketch.id} href={`/${sketch.uid}`} className="block mb-3 text-textDefault hover:text-blue">
										{sketch.data.title}
										{sortMethod === 'recent' && (
											<>
												<br />
												<span className="text-sm text-gray-500">
													{new Date(sketch.data.published_at).toLocaleDateString()}
												</span>
											</>
										)}
									</Link>
								))}
							</div>
							<div className="mt-4 text-left">
								<Link href="#top" className="inline-block text-sm text-blue hover:underline">
									Back to top ↑
								</Link>
							</div>
						</div>
					)
				))}
			</div>
		</>
	);
}

export async function getStaticProps() {
	try {
		const sketches = await client.getAllByType("sketchplanation", {
			orderings: [
				{
					field: "my.sketchplanation.published_at",
					direction: "desc",
				},
			],
			fetch: ['sketchplanation.title', 'sketchplanation.published_at'],
		});

		const sketchTitlesAndDates = sketches.map(({ id, uid, data }) => ({
			id,
			uid,
			data: {
				title: data.title,
				published_at: data.published_at
			}
		}));

		return {
			props: {
				initialSketches: sketchTitlesAndDates,
			},
		};
	} catch (error) {
		console.error("Error fetching sketches:", error);
		return {
			props: {
				initialSketches: [],
			},
		};
	}
}

export default SketchList;