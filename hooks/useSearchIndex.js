import { useCallback, useEffect, useState } from "react";

import {
	categoryToTagResult,
	createCategoryFuse,
	createSketchFuse,
	searchCategories,
	searchSketches,
	sketchToGridResult,
} from "helpers/search/fuseSearch";

// The search index is static per deploy, so load it once and share the parsed
// data and Fuse instances across every useSearch consumer on the page.
let searchIndexPromise = null;

const loadSearchIndex = () => {
	if (!searchIndexPromise) {
		searchIndexPromise = (async () => {
			const [{ default: Fuse }, response] = await Promise.all([
				import("fuse.js"),
				fetch("/api/search-index"),
			]);

			if (!response.ok) {
				throw new Error("Failed to load search index");
			}

			const index = await response.json();

			return {
				index,
				sketchFuse: createSketchFuse(Fuse, index.sketches),
				categoryFuse: createCategoryFuse(Fuse, index.categories),
			};
		})();
	}

	return searchIndexPromise;
};

const useSearchIndex = () => {
	const [searchIndex, setSearchIndex] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const start = () => {
			setLoading(true);

			loadSearchIndex()
				.then((loaded) => {
					if (!cancelled) setSearchIndex(loaded);
				})
				.catch((error) => {
					console.error(error);
					// Let a later mount retry a failed load.
					searchIndexPromise = null;
				})
				.finally(() => {
					if (!cancelled) setLoading(false);
				});
		};

		if (
			typeof window !== "undefined" &&
			typeof window.requestIdleCallback === "function"
		) {
			const idleHandle = window.requestIdleCallback(start, { timeout: 3000 });

			return () => {
				cancelled = true;
				window.cancelIdleCallback(idleHandle);
			};
		}

		const timeoutHandle = window.setTimeout(start, 500);

		return () => {
			cancelled = true;
			window.clearTimeout(timeoutHandle);
		};
	}, []);

	const ready = searchIndex != null;

	const search = useCallback(
		(query, { sketchLimit = 100, categoryLimit = 20 } = {}) => {
			if (!ready || !query?.trim()) {
				return {
					sketches: [],
					categories: [],
					matchQuality: "none",
					correctedLabel: null,
					hasExactCategoryMatch: false,
				};
			}

			const { items: sketchItems, matchQuality, correctedLabel } = searchSketches(
				searchIndex.sketchFuse,
				searchIndex.index.sketches,
				query,
				{ limit: sketchLimit },
			);

			const { items: categoryItems, hasExactMatch } = searchCategories(
				searchIndex.categoryFuse,
				searchIndex.index.categories,
				query,
				{ limit: categoryLimit },
			);

			return {
				sketches: sketchItems.map(sketchToGridResult),
				categories: categoryItems.map(categoryToTagResult),
				matchQuality,
				correctedLabel: correctedLabel ?? null,
				hasExactCategoryMatch: hasExactMatch,
			};
		},
		[ready, searchIndex],
	);

	return { ready, loading, search };
};

export default useSearchIndex;
