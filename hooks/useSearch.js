import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import { isBlank, isPresent } from "helpers";

import useDebouncedValue from "./useDebouncedValue";
import useSearchIndex from "./useSearchIndex";

// A single character is never a meaningful search, so we don't run one.
const MIN_QUERY_LENGTH = 2;

const isSearchableQuery = (value) =>
	isPresent(value) && value.trim().length >= MIN_QUERY_LENGTH;

const fetchIntialResults = async () => {
	const response = await fetch("/api/initial-search-results");
	const results = await response.json();

	return results;
};

const useSearch = () => {
	const router = useRouter();
	const { query: queryParams, pathname } = router;
	const query = queryParams?.q;
	const isSearchPage = pathname === "/search";

	const [originalRoute, setOriginalRoute] = useState(null);
	const [initialResults, setInitialResults] = useState(null);
	const [results, setResults] = useState(null);
	const [tagResults, setTagResults] = useState(null);
	const [matchQuality, setMatchQuality] = useState(null);
	const [correctedLabel, setCorrectedLabel] = useState(null);
	const [hasExactCategoryMatch, setHasExactCategoryMatch] = useState(false);

	const { ready: indexReady, loading: indexLoading, search } = useSearchIndex();

	const prevSearchQuery = useRef(null);
	const debouncedSearchQuery = useDebouncedValue(query, 300);

	useEffect(() => {
		let cancelled = false;
		let idleHandle = null;
		let timeoutHandle = null;

		const load = () => {
			if (cancelled) return;
			fetchIntialResults().then((results) => {
				if (!cancelled) setInitialResults(results);
			});
		};

		if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
			idleHandle = window.requestIdleCallback(load, { timeout: 3000 });
		} else {
			timeoutHandle = window.setTimeout(load, 1000);
		}

		return () => {
			cancelled = true;
			if (idleHandle != null && typeof window.cancelIdleCallback === "function") {
				window.cancelIdleCallback(idleHandle);
			}
			if (timeoutHandle != null) window.clearTimeout(timeoutHandle);
		};
	}, []);

	const setQuery = (query) => {
		if (isBlank(originalRoute)) {
			setOriginalRoute({ pathname, queryParams });
		}

		if (isSearchPage) {
			const stringifiedQuery = new URLSearchParams({ q: query }).toString();

			router.replace(
				{
					pathname,
					query: { ...queryParams, q: query },
				},
				`/search?${stringifiedQuery}`,
				{
					shallow: true,
				},
			);
		} else {
			router.push(
				{
					pathname: isSearchPage ? pathname : "/search",
					query: { ...queryParams, q: query },
				},
				undefined,
				{
					shallow: true,
				},
			);
		}
	};

	const clear = () => {
		router.replace(
			{
				pathname,
				query: { ...queryParams, q: undefined },
			},
			`/search`,
			{
				shallow: true,
			},
		);
	};

	const reset = () => {
		if (isBlank(originalRoute)) {
			return undefined;
		}

		router.replace(
			{
				pathname: originalRoute?.pathname,
				query: originalRoute?.queryParams,
			},
			originalRoute?.pathname,
			{
				shallow: true,
			},
		);

		setOriginalRoute(null);
	};

	const runSearch = useCallback(
		(searchQuery) => {
			const {
				sketches,
				categories,
				matchQuality: quality,
				correctedLabel: label,
				hasExactCategoryMatch: exactCategory,
			} = search(searchQuery);

			setResults(sketches);
			setTagResults(categories);
			setMatchQuality(quality);
			setCorrectedLabel(label);
			setHasExactCategoryMatch(exactCategory);
		},
		[search],
	);

	useEffect(() => {
		if (!isSearchableQuery(debouncedSearchQuery)) {
			setResults(null);
			setTagResults(null);
			setMatchQuality(null);
			setCorrectedLabel(null);
			setHasExactCategoryMatch(false);
			prevSearchQuery.current = null;

			return undefined;
		}

		if (!indexReady) {
			return undefined;
		}

		if (prevSearchQuery.current === debouncedSearchQuery) {
			return undefined;
		}

		prevSearchQuery.current = debouncedSearchQuery;
		runSearch(debouncedSearchQuery);
	}, [debouncedSearchQuery, indexReady, runSearch]);

	const called = isSearchableQuery(debouncedSearchQuery);
	const busy = indexLoading && called;

	return {
		query,
		setQuery,
		initialResults,
		results,
		tagResults,
		matchQuality,
		correctedLabel,
		hasExactCategoryMatch,
		called,
		busy,
		reset,
		clear,
		isSearchPage,
	};
};

export default useSearch;
