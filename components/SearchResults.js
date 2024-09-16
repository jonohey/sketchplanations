import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "./SearchResults.module.css";

import { isPresent } from "helpers";
import useSearch from "hooks/useSearch";

import SketchplanationsGrid from "./SketchplanationsGrid";
import Tags from "./Tags";
import FancyLink from "./FancyLink";
import { Lightbulb } from "lucide-react";
import { Shuffle } from "lucide-react";

const loadingMessages = [
	"Finding some spectacular sketches…",
	"Sketching up a storm…",
	"Searching the archives…",
	"Let me find that for you…",
	"Where did I put that sketch…",
];

const randomLoadingMessage = () => {
	const index = Math.floor(Math.random() * loadingMessages.length);
	return loadingMessages[index];
};

const SearchResults = () => {
	const { initialResults, results, tagResults, called, busy } = useSearch();

	const [randomHandle, setRandomHandle] = useState(null);
	const [loadingMessage, setLoadingMessage] = useState(randomLoadingMessage());

	useEffect(() => {
		if (!busy) return;

		setLoadingMessage(randomLoadingMessage());
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
			<div className={styles["search-results"]}>
				<div className={styles.links}>
					<FancyLink href="/categories" className={styles.link}>
						Categories
					</FancyLink>
					<FancyLink href="/archive" className={styles.link}>
						Archive
					</FancyLink>
				</div>
				<SketchplanationsGrid prismicDocs={initialResults} />
			</div>
		);
	}

	return (
		<div className={styles["search-results"]}>
			{busy ? (
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
					<div className={styles["search-results__tags"]}>
						<Tags tags={tagResults} align="left" />
					</div>
					{isPresent(results) ? (
						<div className={styles["search-results__sketches"]}>
							<SketchplanationsGrid prismicDocs={results} />
						</div>
					) : (
						<div className={styles["search-results__empty"]}>
							<p>No sketches found</p>
							<Link
								href={`/${randomHandle}`}
								className={!randomHandle && "invisible"}
							>
								<span className="inline-flex items-center gap-2">
									<Shuffle size={16} />
									Try something random
								</span>
							</Link>
							<p>
								<FancyLink
									href="https://forms.gle/c6LymLW5vLx9FUeW6"
									target="_blank"
									rel="noopener noreferrer"
								>
									<span className="inline-flex items-center gap-2">
										<Lightbulb size={16} />
										Let me know if you think I’m missing something
									</span>
								</FancyLink>
							</p>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default SearchResults;
