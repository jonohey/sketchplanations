import { track } from "@vercel/analytics";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { arrangeReaderQuotes, seededRandom } from "helpers/pickReaderQuotes";
import { READER_QUOTES } from "helpers/readerQuotes";
import styles from "./ReaderQuotes.module.css";

// The columns are rendered three times so scrolling can loop: whenever the
// view drifts more than half a set from the middle copy, it jumps back by
// exactly one set, which looks identical.
const COPIES = [0, 1, 2];
const LOOP_SETTLE_MS = 120;

const ReaderQuotes = ({ heading = "What people say" }) => {
	const scrollRef = useRef(null);
	const settleRef = useRef(null);
	const scrollTrackedRef = useRef(false);
	const [columns, setColumns] = useState(() =>
		arrangeReaderQuotes(READER_QUOTES, seededRandom(1)),
	);
	const [ready, setReady] = useState(false);

	// Shuffle after hydration so the server render stays stable.
	useEffect(() => {
		setColumns(arrangeReaderQuotes(READER_QUOTES));
		setReady(true);
	}, []);

	const measureSet = useCallback(() => {
		const el = scrollRef.current;
		const first = el?.querySelector('[data-set-start="1"]');
		const next = el?.querySelector('[data-set-start="2"]');
		if (!first || !next) return null;
		return {
			el,
			start: first.offsetLeft,
			width: next.offsetLeft - first.offsetLeft,
			firstWidth: first.offsetWidth,
		};
	}, []);

	const centreOnStart = useCallback(() => {
		const set = measureSet();
		if (!set) return;
		set.el.scrollLeft =
			set.start - (set.el.clientWidth - set.firstWidth) / 2;
	}, [measureSet]);

	useEffect(() => {
		if (!ready) return undefined;
		centreOnStart();
		window.addEventListener("resize", centreOnStart);
		return () => window.removeEventListener("resize", centreOnStart);
	}, [ready, centreOnStart]);

	useEffect(() => () => clearTimeout(settleRef.current), []);

	const loopIfNeeded = () => {
		const set = measureSet();
		if (!set || set.width <= 0) return;
		const centre = set.el.scrollLeft + set.el.clientWidth / 2;
		const offset = centre - (set.start + set.width / 2);
		if (Math.abs(offset) > set.width / 2) {
			set.el.scrollLeft -= Math.sign(offset) * set.width;
		}
	};

	const onScroll = () => {
		clearTimeout(settleRef.current);
		settleRef.current = setTimeout(loopIfNeeded, LOOP_SETTLE_MS);
		if (ready && !scrollTrackedRef.current) {
			scrollTrackedRef.current = true;
			track("reader_quotes_scroll");
		}
	};

	const scrollByDirection = (direction) => {
		const el = scrollRef.current;
		if (!el) return;
		el.scrollBy({
			left: Math.round(el.clientWidth * 0.6) * direction,
			behavior: "smooth",
		});
	};

	return (
		<section
			className={styles.section}
			aria-labelledby="reader-quotes-heading"
			id="reader-quotes"
		>
			<div className={styles.header}>
				<img
					src="/images/explainer-kit/sketch-icons/Singing.svg"
					alt=""
					width={348}
					height={575}
					loading="lazy"
					className={styles.icon}
				/>
				<h2 id="reader-quotes-heading" className={styles.heading}>
					{heading}
				</h2>
			</div>
			<div className={styles.trackOuter}>
				<button
					type="button"
					className={`${styles.arrow} ${styles.arrowLeft}`}
					aria-label="Previous quotes"
					onClick={() => scrollByDirection(-1)}
				>
					<ChevronLeft size={18} strokeWidth={2} />
				</button>
				<div ref={scrollRef} className={styles.track} onScroll={onScroll}>
					{COPIES.map((copy) =>
						columns.map((column, index) => (
							<div
								key={`${copy}-${column[0].id}`}
								className={styles.column}
							>
								{column.map((quote, row) => (
									<blockquote
										key={quote.id}
										className={styles.card}
										aria-hidden={copy !== 1 || undefined}
										data-set-start={
											index === 0 && row === 0 ? copy : undefined
										}
									>
										<p>{quote.quote}</p>
									</blockquote>
								))}
							</div>
						)),
					)}
				</div>
				<button
					type="button"
					className={`${styles.arrow} ${styles.arrowRight}`}
					aria-label="More quotes"
					onClick={() => scrollByDirection(1)}
				>
					<ChevronRight size={18} strokeWidth={2} />
				</button>
			</div>
		</section>
	);
};

export default ReaderQuotes;
