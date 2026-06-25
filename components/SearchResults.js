import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "./SearchResults.module.css";

import { isPresent } from "helpers";
import {
	shouldShowStretchMissMessage,
	shouldShowSuggestMissingSketch,
} from "helpers/search/rudeSearch";
import useSearch from "hooks/useSearch";

import { Lightbulb, Shuffle } from "lucide-react";
import FancyLink from "./FancyLink";
import RudeSearchEasterEgg from "./RudeSearchEasterEgg";
import SearchCategoryMatches from "./SearchCategoryMatches";
import SketchplanationsGrid from "./SketchplanationsGrid";

const loadingMessages = [
	"Finding some spectacular sketches…",
	"Sketching up a storm…",
	"Searching the archives…",
	"Let me find that for you…",
	"Flicking through the catalogue…",
	"Now, where did I put that sketch…",
	"I know it's here somewhere…",
	"Sifting through the vaults…",
	"Hmm, tum, tum. What did I do with that one?…",
	"Back in a jiffy…",
	"One does not simply walk into the sketch…", // Boromir
	"A noble quest for the Holy Sketch…", // Holy Grail
	"Just keep searching, just keep searching…", // Finding Dory
	"Just one more thing…that sketch you want…", // Colombo
	"Ze little grey cells are working on it, mon ami…", // Poirot
	"This sketch ain't going to find itself…", // Sam Spade
	"The streets are mean, but I'll find your sketch…", // Philip Marlowe
	"The game is afoot, we'll have it soon, Watson…", // Sherlock
	"It's elementary, the sketch can't hide…", // Sherlock
	"Ah, the case of the missing sketch…", // Sherlock
	"My pipe Watson—this search may take a moment…", // Sherlock
	"No time for half measures, Watson, they need that sketch…", // Sherlock
];

const randomLoadingMessage = () => {
	const index = Math.floor(Math.random() * loadingMessages.length);
	return loadingMessages[index];
};

const MIN_LOADING_TIME = 1000;

const SUGGEST_IDEA_URL = "https://forms.gle/c6LymLW5vLx9FUeW6";

const SuggestMissingSketch = () => (
	<p>
		<FancyLink href={SUGGEST_IDEA_URL} target="_blank" rel="noopener noreferrer">
			<span className="inline-flex items-center gap-2">
				<Lightbulb size={16} />
				Let me know what I&apos;m missing
			</span>
		</FancyLink>
	</p>
);

const SearchResults = () => {
	const {
		initialResults,
		results,
		tagResults,
		matchQuality,
		correctedLabel,
		hasExactCategoryMatch,
		called,
		busy,
		showRudeSearchEasterEgg,
	} = useSearch();

	const [randomHandle, setRandomHandle] = useState(null);
	const [loadingMessage, setLoadingMessage] = useState(randomLoadingMessage());
	const [showLoading, setShowLoading] = useState(false);

	useEffect(() => {
		let timer;
		if (busy) {
		setShowLoading(true);
		setLoadingMessage(randomLoadingMessage());
		timer = setTimeout(() => {
			if (!busy) setShowLoading(false);
		}, MIN_LOADING_TIME);
		} else {
		timer = setTimeout(() => {
			setShowLoading(false);
		}, MIN_LOADING_TIME);
		}
		return () => clearTimeout(timer);
	}, [busy]);

	useEffect(() => {
		const fetchRandomHandle = async () => {
			try {
				const res = await fetch("/api/random");
				const { handle } = await res.json();
				setRandomHandle(handle);
			} catch (error) {
				console.error(error);
			}
		};

		fetchRandomHandle();
	}, []);
	if (!called) {
		return (
			<>
				<div className="text-center mt-8 mb-8">
					<p className="text-textSubdued text-sm mb-2">More ways to explore</p>
					<FancyLink href="/categories">Categories</FancyLink>
					<span className="mx-2">·</span>
					<FancyLink href="/archive">Archive</FancyLink>
					<span className="mx-2">·</span>
					<FancyLink href="/list">List</FancyLink>
				</div>
				<div className={styles["search-results"]}>				
					<SketchplanationsGrid prismicDocs={initialResults} />
				</div>
			</>
		);
	}

	const hasSketches = isPresent(results);
	const hasCategories = isPresent(tagResults);
	const isCorrected = matchQuality === "corrected";
	const isStretchMatch = matchQuality === "weak" && !hasExactCategoryMatch;
	const isEmpty = !hasSketches && !hasCategories;
	const showStretchMissMessage = shouldShowStretchMissMessage(
		isStretchMatch,
		showRudeSearchEasterEgg,
	);
	const showSuggestMissingSketch =
		shouldShowSuggestMissingSketch(showRudeSearchEasterEgg);

	return (
		<div className={styles["search-results"]}>
			{showLoading ? (
				<div className={styles["loading-indicator"]}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<title>Loading…</title>
						<path d="M0 11c.511-6.158 5.685-11 12-11s11.489 4.842 12 11h-2.009c-.506-5.046-4.793-9-9.991-9s-9.485 3.954-9.991 9h-2.009zm21.991 2c-.506 5.046-4.793 9-9.991 9s-9.485-3.954-9.991-9h-2.009c.511 6.158 5.685 11 12 11s11.489-4.842 12-11h-2.009z" />
					</svg>
					{loadingMessage}
				</div>
			) : (
				<>
					{showRudeSearchEasterEgg && <RudeSearchEasterEgg />}
					{hasCategories && (
						<SearchCategoryMatches categories={tagResults} />
					)}
					{isEmpty ? (
						<div className={styles["search-results__empty"]}>
							<p>No sketches found</p>
							<Link
								href={`/${randomHandle}`}
								className={!randomHandle && "invisible"}
							>
								<span className="inline-flex items-center gap-2">
									<Shuffle size={16} />
									Try a random sketch?
								</span>
							</Link>
							{showSuggestMissingSketch && <SuggestMissingSketch />}
						</div>
					) : (
						<>
							{isCorrected && correctedLabel && (
								<p className={styles["search-results__corrected-heading"]}>
									Showing results for <strong>{correctedLabel}</strong>
								</p>
							)}
							{showStretchMissMessage && (
								<div className={styles["search-results__empty"]}>
									<p>No close matches found</p>
									<SuggestMissingSketch />
								</div>
							)}
							{hasSketches && (
								<div className={styles["search-results__sketches"]}>
									<div
										className={`${styles["search-results__sketches-header"]}${
											hasCategories
												? ` ${styles["search-results__sketches-header--bordered"]}`
												: ""
										}`}
									>
										<h2 className={styles["search-results__sketches-title"]}>
											Sketches
										</h2>
										<p className={styles["search-results__sketches-count"]}>
											{results.length}{" "}
											{results.length === 1 ? "result" : "results"}
										</p>
									</div>
									{isStretchMatch && (
										<p className={styles["search-results__weak-heading"]}>
											Could these be what you were looking for?
										</p>
									)}
									<SketchplanationsGrid prismicDocs={results} />
								</div>
							)}
						</>
					)}
				</>
			)}
		</div>
	);
};

export default SearchResults;
