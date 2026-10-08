import { track } from "@vercel/analytics";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./ReaderQuotes.module.css";

import { arrangeReaderQuotes, seededRandom } from "helpers/pickReaderQuotes";
import { READER_QUOTES } from "helpers/readerQuotes";

// The columns are rendered three times so scrolling can loop: whenever the
// view drifts more than half a set from the middle copy, it jumps back by
// exactly one set, which looks identical.
const COPIES = [0, 1, 2];
const LOOP_SETTLE_MS = 120;
const SHARE_FORM_URL = "https://forms.gle/eozBb25xsRnd6jDx7";

const DEFAULT_ICON = {
	src: "/images/explainer-kit/sketch-icons/Singing.svg",
	width: 348,
	height: 575,
};
const DEFAULT_INVITE = {
	href: SHARE_FORM_URL,
	label: "Like Sketchplanations? Add your own comment →",
};
const SOURCE_LABELS = {
	amazon: "Amazon reviewer",
	goodreads: "Goodreads reviewer",
};

// Quotes with a `source` (and optional `rating`) get a credit line, for
// reviews from public sites; `sourceLinks` maps a source to the page the
// credit links to. Pass `invite={null}` to drop the invite link.
const ReaderQuotes = ({
	quotes = READER_QUOTES,
	heading = "What people say",
	id = "reader-quotes",
	icon = DEFAULT_ICON,
	invite = DEFAULT_INVITE,
	sourceLinks = {},
	analyticsPrefix = "reader_quotes",
	className = "",
}) => {
	const scrollRef = useRef(null);
	const settleRef = useRef(null);
	const scrollTrackedRef = useRef(false);
	const userIntentRef = useRef(false);
	const [columns, setColumns] = useState(() =>
		arrangeReaderQuotes(quotes, seededRandom(1)),
	);
	const [ready, setReady] = useState(false);

	// Shuffle after hydration so the server render stays stable.
	useEffect(() => {
		setColumns(arrangeReaderQuotes(quotes));
		setReady(true);
	}, [quotes]);

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
		set.el.scrollLeft = set.start - (set.el.clientWidth - set.firstWidth) / 2;
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

	// Our own scrolling (centring on load, looping) also fires scroll events,
	// so only count a scroll once the reader has touched, swiped or clicked.
	const markUserIntent = () => {
		userIntentRef.current = true;
	};

	const onWheel = (event) => {
		if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) markUserIntent();
	};

	const onScroll = () => {
		clearTimeout(settleRef.current);
		settleRef.current = setTimeout(loopIfNeeded, LOOP_SETTLE_MS);
		if (userIntentRef.current && !scrollTrackedRef.current) {
			scrollTrackedRef.current = true;
			track(`${analyticsPrefix}_scroll`);
		}
	};

	const scrollByDirection = (direction) => {
		const el = scrollRef.current;
		if (!el) return;
		markUserIntent();
		el.scrollBy({
			left: Math.round(el.clientWidth * 0.6) * direction,
			behavior: "smooth",
		});
	};

	return (
		<section
			className={`${styles.section} ${className}`}
			aria-labelledby={`${id}-heading`}
			id={id}
		>
			<div className={styles.header}>
				<img
					src={icon.src}
					alt=""
					width={icon.width}
					height={icon.height}
					loading="lazy"
					className={styles.icon}
				/>
				<h2 id={`${id}-heading`} className={styles.heading}>
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
				<div
					ref={scrollRef}
					className={styles.track}
					onScroll={onScroll}
					onPointerDown={markUserIntent}
					onWheel={onWheel}
				>
					{COPIES.map((copy) =>
						columns.map((column, index) => (
							<div key={`${copy}-${column[0].id}`} className={styles.column}>
								{column.map((quote, row) => (
									<blockquote
										key={quote.id}
										className={styles.card}
										aria-hidden={copy !== 1 || undefined}
										data-set-start={index === 0 && row === 0 ? copy : undefined}
									>
										<p>{quote.quote}</p>
										{quote.source && (
											<footer className={styles.credit}>
												{quote.rating && (
													<span
														className={styles.stars}
														role="img"
														aria-label={`${quote.rating} out of 5 stars`}
													>
														{"★".repeat(quote.rating)}
													</span>
												)}
												{sourceLinks[quote.source] ? (
													<a
														href={sourceLinks[quote.source]}
														target="_blank"
														rel="noopener noreferrer"
														tabIndex={copy !== 1 ? -1 : undefined}
													>
														{SOURCE_LABELS[quote.source] ?? quote.source}
													</a>
												) : (
													(SOURCE_LABELS[quote.source] ?? quote.source)
												)}
											</footer>
										)}
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
			{invite && (
				<p className={styles.invite}>
					<a
						href={invite.href}
						target="_blank"
						rel="noopener noreferrer"
						onClick={() => track(`${analyticsPrefix}_submit`)}
					>
						{invite.label}
					</a>
				</p>
			)}
		</section>
	);
};

export default ReaderQuotes;
