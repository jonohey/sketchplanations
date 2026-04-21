import { track } from "@vercel/analytics";
import { PrismicNextImage } from "@prismicio/next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

import FancyLink from "components/FancyLink";
import { humanizePublishedDate } from "helpers";
import styles from "./HomeCategoryCarousel.module.css";

const SCROLL_DEBOUNCE_MS = 220;

function useCarouselScrollTracking(categoryLabel, scrollRef) {
	const reportedRef = useRef(false);
	const debounceRef = useRef(null);

	const reportScroll = useCallback(() => {
		if (reportedRef.current) return;
		reportedRef.current = true;
		track("homepage_carousel_scroll", { category: categoryLabel });
	}, [categoryLabel]);

	const onScroll = useCallback(() => {
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			const el = scrollRef.current;
			if (el && el.scrollLeft > 2) {
				reportScroll();
			}
		}, SCROLL_DEBOUNCE_MS);
	}, [scrollRef, reportScroll]);

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	return { onScroll, reportScroll };
}

const SKELETON_CARD_COUNT = 8;

function CarouselRowSkeleton({
	label,
	viewAllHref,
	headingId,
	sectionId,
	headingAs: HeadingTag,
}) {
	return (
		<section
			className={styles.section}
			aria-labelledby={headingId}
			id={sectionId}
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className={styles.header}>
					<HeadingTag
						className={`${styles.title} ${
							HeadingTag === "h3" ? styles.titleH3 : styles.titleH2
						}`}
						id={headingId}
					>
						<Link href={viewAllHref} className={styles.titleLink}>
							{label}
						</Link>
					</HeadingTag>
				</div>
			</div>
			<div className={styles.trackOuter}>
				<div
					className={`${styles.track} ${styles.skeletonTrack}`}
					aria-hidden="true"
				>
					{Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: placeholder cards are static
						<div key={i} className={styles.card}>
							<span className={`${styles.imageWrap} ${styles.skeletonShimmer}`} />
							<span className={styles.skeletonTitle} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function HomeCategoryCarouselRow({
	label,
	viewAllHref,
	sketches,
	category: categoryLabel,
	headingId,
	sectionId,
	headingAs: HeadingTag = "h2",
	priorityImage = false,
	showPublishedDate = false,
	deferMount = false,
	prefetchCards = false,
}) {
	const router = useRouter();
	const scrollRef = useRef(null);
	const scrollFrameRef = useRef(null);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const [canNavigate, setCanNavigate] = useState(false);
	const [isMounted, setIsMounted] = useState(!deferMount);
	const { onScroll, reportScroll } = useCarouselScrollTracking(
		categoryLabel,
		scrollRef,
	);

	const updateScrollState = useCallback(() => {
		const el = scrollRef.current;
		if (!el) return;
		const { scrollLeft, scrollWidth, clientWidth } = el;
		const overflow = scrollWidth > clientWidth + 1;
		setCanNavigate(overflow);
		setCanScrollLeft(scrollLeft > 2);
		setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
	}, []);

	const scheduleUpdateScrollState = useCallback(() => {
		if (scrollFrameRef.current != null) return;
		scrollFrameRef.current = window.requestAnimationFrame(() => {
			scrollFrameRef.current = null;
			updateScrollState();
		});
	}, [updateScrollState]);

	useEffect(
		() => () => {
			if (scrollFrameRef.current != null) {
				window.cancelAnimationFrame(scrollFrameRef.current);
				scrollFrameRef.current = null;
			}
		},
		[],
	);

	useEffect(() => {
		if (!deferMount || isMounted) return undefined;

		let cancelled = false;
		let idleHandle = null;
		let timeoutHandle = null;

		const activate = () => {
			if (cancelled) return;
			const flip = () => {
				if (!cancelled) setIsMounted(true);
			};
			if (typeof window.requestIdleCallback === "function") {
				idleHandle = window.requestIdleCallback(flip, { timeout: 2000 });
			} else {
				timeoutHandle = window.setTimeout(flip, 200);
			}
		};

		if (document.readyState === "complete") {
			activate();
		} else {
			window.addEventListener("load", activate, { once: true });
		}

		return () => {
			cancelled = true;
			window.removeEventListener("load", activate);
			if (idleHandle && typeof window.cancelIdleCallback === "function") {
				window.cancelIdleCallback(idleHandle);
			}
			if (timeoutHandle) window.clearTimeout(timeoutHandle);
		};
	}, [deferMount, isMounted]);

	useEffect(() => {
		if (!isMounted) return undefined;
		const el = scrollRef.current;
		if (!el) return undefined;
		updateScrollState();
		const ro = new ResizeObserver(scheduleUpdateScrollState);
		ro.observe(el);
		return () => ro.disconnect();
	}, [updateScrollState, scheduleUpdateScrollState, sketches, isMounted]);

	const scrollByDirection = (direction) => {
		const el = scrollRef.current;
		if (!el) return;
		reportScroll();
		const delta = Math.round(el.clientWidth * 0.85) * direction;
		el.scrollBy({ left: delta, behavior: "smooth" });
	};

	if (!isMounted) {
		return (
			<CarouselRowSkeleton
				label={label}
				viewAllHref={viewAllHref}
				headingId={headingId}
				sectionId={sectionId}
				headingAs={HeadingTag}
			/>
		);
	}

	return (
		<section
			className={styles.section}
			aria-labelledby={headingId}
			id={sectionId}
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className={styles.header}>
					<HeadingTag
						className={`${styles.title} ${
							HeadingTag === "h3" ? styles.titleH3 : styles.titleH2
						}`}
						id={headingId}
					>
						<Link
							href={viewAllHref}
							className={styles.titleLink}
							onClick={() =>
								track("homepage_carousel_view_all_click", {
									category: categoryLabel,
								})
							}
						>
							{label}
						</Link>
					</HeadingTag>
				</div>
			</div>

			<div className={styles.trackOuter}>
				{canNavigate && canScrollLeft && (
					<span className={`${styles.fade} ${styles.fadeLeft}`} aria-hidden="true" />
				)}
				{canNavigate && canScrollRight && (
					<span className={`${styles.fade} ${styles.fadeRight}`} aria-hidden="true" />
				)}
				{canNavigate && canScrollLeft && (
					<button
						type="button"
						className={`${styles.arrow} ${styles.arrowLeft}`}
						aria-label="Scroll left"
						onClick={() => scrollByDirection(-1)}
					>
						<ChevronLeft size={20} strokeWidth={2} />
					</button>
				)}
				<div
					ref={scrollRef}
					className={styles.track}
					onScroll={() => {
						onScroll();
						scheduleUpdateScrollState();
					}}
				>
					{sketches.map((sketch, index) => {
						const sketchHref = `/${sketch.uid}`;
						const prefetchOnIntent = prefetchCards
							? undefined
							: () => router.prefetch(sketchHref);
						return (
							<Link
								key={sketch.uid}
								href={sketchHref}
								className={styles.card}
								target="_blank"
								rel="noopener"
								prefetch={prefetchCards ? undefined : false}
								onMouseEnter={prefetchOnIntent}
								onFocus={prefetchOnIntent}
								onTouchStart={prefetchOnIntent}
								onClick={() =>
									track("homepage_carousel_sketch_click", {
										category: categoryLabel,
										sketch: sketch.title,
									})
								}
							>
								<span className={styles.imageWrap}>
									<PrismicNextImage
										field={sketch.image}
										className={styles.image}
										fill
										sizes="(max-width: 639px) min(15rem, calc(100vw - 4.5rem)), (max-width: 767px) 11rem, (max-width: 1023px) 12rem, 13rem"
										priority={priorityImage && index === 0}
										loading={
											priorityImage && index === 0
												? undefined
												: deferMount
													? "eager"
													: "lazy"
										}
										fetchPriority={deferMount ? "low" : undefined}
										imgixParams={{
											fit: "crop",
											crop: "top",
											ar: "1:1",
										}}
										fallbackAlt=""
									/>
								</span>
								<span className={styles.cardTitle}>{sketch.title}</span>
								{showPublishedDate && sketch.publishedAt && (
									<time
										className={styles.cardDate}
										dateTime={sketch.publishedAt}
									>
										{humanizePublishedDate(sketch.publishedAt)}
									</time>
								)}
								<span className="sr-only"> (opens in new tab)</span>
							</Link>
						);
					})}
					<Link
						href={viewAllHref}
						className={styles.viewAllCard}
						onClick={() =>
							track("homepage_carousel_view_all_click", {
								category: categoryLabel,
							})
						}
					>
						<span className={styles.viewAllCardInner}>
							<span className={styles.viewAllCardLabel}>
								View all
								<ChevronRight size={16} strokeWidth={2} />
							</span>
						</span>
					</Link>
				</div>
				{canNavigate && (
					<button
						type="button"
						className={`${styles.arrow} ${styles.arrowRight}`}
						aria-label="Scroll right"
						disabled={!canScrollRight}
						onClick={() => scrollByDirection(1)}
					>
						<ChevronRight size={20} strokeWidth={2} />
					</button>
				)}
			</div>
		</section>
	);
}

export default function HomeCategoryCarousels({ rows, interlude = null }) {
	if (!rows?.length) return null;

	const recentRows = rows.filter((row) => row.kind === "recent");
	const categoryRows = rows.filter((row) => row.kind === "category");

	return (
		<div id="home-category-carousels">
			{recentRows.map((row, index) => (
				<HomeCategoryCarouselRow
					key="recent"
					label={row.label}
					viewAllHref={row.viewAllHref}
					sketches={row.sketches}
					category={row.label}
					headingId="carousel-heading-recent"
					sectionId="recent-sketches"
					headingAs="h2"
					priorityImage={index === 0}
					showPublishedDate
					prefetchCards
				/>
			))}

			{interlude}

			{categoryRows.length > 0 && (
				<section
					className={styles.groupSection}
					aria-labelledby="carousel-group-explore"
				>
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<h2 id="carousel-group-explore" className={styles.groupHeading}>
							Explore visuals for
						</h2>
					</div>
					{categoryRows.map((row) => (
						<HomeCategoryCarouselRow
							key={row.slug}
							label={row.label}
							viewAllHref={row.viewAllHref}
							sketches={row.sketches}
							category={row.label}
							headingId={`carousel-heading-${row.slug}`}
							headingAs="h3"
							deferMount
						/>
					))}
					<div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${styles.andMoreWrap}`}>
						<FancyLink
							href="/search"
							className={styles.andMoreLink}
							onClick={() =>
								track("homepage_carousel_and_more_click")
							}
						>
							…and many more
						</FancyLink>
					</div>
				</section>
			)}
		</div>
	);
}
