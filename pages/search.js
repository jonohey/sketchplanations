import Head from "next/head";
import styles from "./search.module.css";

import SearchForm from "components/SearchForm";
import SearchResults from "components/SearchResults";
import { isPresent, pageTitle } from "helpers";
import useSearch from "hooks/useSearch";

const Search = () => {
	const { query, setQuery, clear, busy } = useSearch();

	const dynamicPageTitle = isPresent(query) ? `Search: ${query}` : "Search";

	return (
		<>
			<Head>
				<title>{pageTitle(dynamicPageTitle)}</title>
				<meta
					name="description"
					content="Search and explore hundreds of simple, clear explanations on science, creativity, psychology, and more. Find your favourite Sketchplanations in seconds."
				/>
			</Head>
			<header className="pt-6 px-4">
				<div className="prose mx-auto text-center">
					<h1 className="text-2xl">Search</h1>
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
