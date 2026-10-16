import Head from "next/head";
import Image from "next/image";

import styles from "./search.module.css";

import SearchForm from "components/SearchForm";
import SearchResults from "components/SearchResults";
import { isPresent, pageTitle } from "helpers";
import useSearch from "hooks/useSearch";

const Search = () => {
	const { query, setQuery, clear, busy } = useSearch();

	const dynamicPageTitle = isPresent(query) ? `Search: ${query}` : "Search";
	const queryIsPresent = isPresent(query);

	return (
		<>
			<Head>
				<title>{pageTitle(dynamicPageTitle)}</title>
				<meta
					name="description"
					content="Search and explore hundreds of simple, clear explanations on science, creativity, psychology, and more. Find your favourite Sketchplanations in seconds."
				/>
				{queryIsPresent && <meta name="robots" content="noindex, nofollow" />}
				<link rel="canonical" href="https://sketchplanations.com/search" />
			</Head>
			<header className="pt-6 px-4">
				<div className="prose mx-auto flex items-center justify-center gap-3">
					<Image
						src="/images/explainer-kit/sketch-icons/person-kneeling-magnifying-glass@0.5x.png"
						width={238}
						height={173}
						alt=""
						sizes="(min-width: 640px) 80px, 64px"
						priority
						className="not-prose h-auto w-16 sm:w-20 dark:rounded-lg dark:bg-[#f1f1f1] dark:p-1"
					/>
					<h1 className="m-0 text-2xl">Search</h1>
				</div>
			</header>
			<div className={styles.root}>
				<div className={styles["search-form"]}>
					<SearchForm
						isBusy={busy}
						value={query}
						onChange={setQuery}
						onClear={clear}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								clear();
							}
						}}
						autoFocus
					/>
				</div>
				<SearchResults />
			</div>
		</>
	);
};

export default Search;
