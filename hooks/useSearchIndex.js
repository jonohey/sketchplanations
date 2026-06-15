import { useCallback, useEffect, useRef, useState } from "react";

import {
	categoryToTagResult,
	createCategoryFuse,
	createSketchFuse,
	searchCategories,
	searchSketches,
	sketchToGridResult,
} from "helpers/search/fuseSearch";

const useSearchIndex = () => {
	const [ready, setReady] = useState(false);
	const [loading, setLoading] = useState(false);
	const indexRef = useRef(null);
	const sketchFuseRef = useRef(null);
	const categoryFuseRef = useRef(null);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			setLoading(true);

			try {
				const [{ default: Fuse }, response] = await Promise.all([
					import("fuse.js"),
					fetch("/api/search-index"),
				]);

				if (!response.ok) {
					throw new Error("Failed to load search index");
				}

				const index = await response.json();

				if (cancelled) return;

				indexRef.current = index;
				sketchFuseRef.current = createSketchFuse(Fuse, index.sketches);
				categoryFuseRef.current = createCategoryFuse(Fuse, index.categories);
				setReady(true);
			} catch (error) {
				console.error(error);
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
			const idleHandle = window.requestIdleCallback(load, { timeout: 3000 });

			return () => {
				cancelled = true;
				window.cancelIdleCallback(idleHandle);
			};
		}

		const timeoutHandle = window.setTimeout(load, 500);

		return () => {
			cancelled = true;
			window.clearTimeout(timeoutHandle);
		};
	}, []);

	const search = useCallback((query, { sketchLimit = 100, categoryLimit = 20 } = {}) => {
		if (!ready || !query?.trim()) {
			return {
				sketches: [],
				categories: [],
				matchQuality: "none",
				hasExactCategoryMatch: false,
			};
		}

		const { items: sketchItems, matchQuality } = searchSketches(
			sketchFuseRef.current,
			indexRef.current.sketches,
			query,
			{ limit: sketchLimit },
		);

		const { items: categoryItems, hasExactMatch: hasExactCategoryMatch } =
			searchCategories(
				categoryFuseRef.current,
				indexRef.current.categories,
				query,
				{ limit: categoryLimit },
			);

		return {
			sketches: sketchItems.map(sketchToGridResult),
			categories: categoryItems.map(categoryToTagResult),
			matchQuality,
			hasExactCategoryMatch,
		};
	}, [ready]);

	return { ready, loading, search };
};

export default useSearchIndex;
