import { track } from "@vercel/analytics";
import FancyLink from "components/FancyLink";
import TextHeader from "components/TextHeader";
import booksIndex from "data/books-index.json";
import { fastScrollToTop, pageTitle } from "helpers";
import Head from "next/head";
import Link from "next/link";
import classNames from "classnames";
import { ChevronDown } from "lucide-react";

import styles from "./books.module.css";

const trackBooksBuyLink = (book, location) => {
	track("Books-buy-link", {
		book: book.title,
		location,
	});
};

const BookBuyLink = ({ book, className, children, location, ...props }) => (
	<a
		href={book.url}
		target="_blank"
		rel="sponsored noopener noreferrer"
		className={className}
		onClick={() => trackBooksBuyLink(book, location)}
		{...props}
	>
		{children}
	</a>
);

const FEATURED_COUNT = 8;
const VISIBLE_SKETCHES = 2;

const BookCover = ({ book }) => {
	const coverClassName = classNames(styles.coverImage, "rounded");

	return (
		<BookBuyLink
			book={book}
			className={styles.coverLink}
			location="cover"
			aria-label={`Buy ${book.title}`}
		>
			{book.thumbnail ? (
				<img
					src={book.thumbnail}
					alt=""
					width={112}
					height={168}
					loading="lazy"
					decoding="async"
					className={coverClassName}
				/>
			) : (
				<span className={classNames(coverClassName, styles.coverPlaceholder)} />
			)}
		</BookBuyLink>
	);
};

const BookTitle = ({ book }) => (
	<div className={styles.bookHeading}>
		<h3 className={styles.bookTitle}>
			<BookBuyLink
				book={book}
				className="text-text no-underline hover:text-blue"
				location="title"
			>
				{book.title}
			</BookBuyLink>
		</h3>
		{book.author ? (
			<p className={styles.bookAuthor}>
				by{" "}
				<BookBuyLink
					book={book}
					className="text-textSubdued no-underline"
					location="author"
				>
					{book.author}
				</BookBuyLink>
			</p>
		) : null}
	</div>
);

const SketchLink = ({ sketch }) => (
	<li className={styles.sketchItem} title={sketch.title}>
		<Link href={`/${sketch.uid}`} className={styles.sketchLink}>
			{sketch.title}
		</Link>
	</li>
);

const BookRow = ({ book, featured = false }) => {
	const hasMore = book.sketches.length > VISIBLE_SKETCHES + 1;
	const visible = hasMore
		? book.sketches.slice(0, VISIBLE_SKETCHES)
		: book.sketches;
	const rest = hasMore ? book.sketches.slice(VISIBLE_SKETCHES) : [];

	return (
		<article
			className={classNames(styles.bookRow, featured && styles.bookRowFeatured)}
		>
			<BookCover book={book} />

			<div className={styles.bookContent}>
				<BookTitle book={book} />

				{book.note ? <p className={styles.bookNote}>{book.note}</p> : null}

				<div className={styles.referencedSection}>
					<p className={styles.referencedLabel}>Sketches</p>
					<ul>
						{visible.map((sketch) => (
							<SketchLink key={sketch.uid} sketch={sketch} />
						))}
					</ul>
					{hasMore ? (
						<details className={styles.moreSketches}>
							<summary>
								+{rest.length} more
								<ChevronDown size={14} aria-hidden="true" />
							</summary>
							<ul>
								{rest.map((sketch) => (
									<SketchLink key={sketch.uid} sketch={sketch} />
								))}
							</ul>
						</details>
					) : null}
				</div>

				<div className={`not-prose ${styles.buyAction}`}>
					<BookBuyLink
						book={book}
						className="btn-outline inline-block no-underline"
						location="button"
					>
						Buy
					</BookBuyLink>
				</div>
			</div>
		</article>
	);
};

const Books = ({ books }) => {
	const featured = books.slice(0, FEATURED_COUNT);
	const rest = books.slice(FEATURED_COUNT);

	return (
		<>
			<Head>
				<title>{pageTitle("Books")}</title>
				<meta
					name="description"
					content="Books that taught the ideas behind Sketchplanations — a reading list from the sketches."
				/>
				<link rel="canonical" href="https://sketchplanations.com/books" />
				<meta property="og:title" content="Books" />
				<meta
					property="og:description"
					content="Books that taught the ideas behind Sketchplanations — a reading list from the sketches."
				/>
				<meta property="og:url" content="https://sketchplanations.com/books" />
				<meta name="twitter:card" content="summary" />
			</Head>
			<div id="top" className="max-w-5xl mx-auto px-5 pb-16 scroll-mt-24">
				<div className="prose max-w-none text-center pt-12 pb-6">
					<div className="not-prose">
						<TextHeader>Books</TextHeader>
					</div>
					<p className="lead mx-auto max-w-2xl mb-3">
						Looking for books to expand your mind and change how you think about
						the world? Many of my sketches explain ideas I learned from books.
						Here are those books.
					</p>
					<p className="mx-auto max-w-2xl mb-3">
						At the top are the books behind the most sketches, a great place to
						start. Further down are more books I&apos;ve drawn on, from
						psychology and science to creativity and business.
					</p>
					<p className="mx-auto max-w-2xl text-sm text-textSubdued my-0">
						Links are affiliate links, so I may earn a commission at no extra
						cost to you.
						<br />
						Thanks for supporting the site!
					</p>
				</div>

				{books.length > 0 ? (
					<>
						<section aria-labelledby="start-here">
							<h2 id="start-here" className={styles.sectionHeading}>
								Start here
							</h2>
							<p className={styles.sectionIntro}>
								The books behind the most sketches.
							</p>
							<ul className={styles.bookList}>
								{featured.map((book) => (
									<li key={book.title}>
										<BookRow book={book} featured />
									</li>
								))}
							</ul>
						</section>

						{rest.length > 0 ? (
							<section aria-labelledby="more-books">
								<h2 id="more-books" className={styles.sectionHeading}>
									More books
								</h2>
								<ul className={styles.bookList}>
									{rest.map((book) => (
										<li key={book.title}>
											<BookRow book={book} />
										</li>
									))}
								</ul>
							</section>
						) : null}

						<div className={styles.pageFooter}>
							<p>
								This list is automatically generated from book links in my
								sketch articles. If something looks wrong, please{" "}
								<FancyLink href="mailto:jono.hey@gmail.com?subject=Books%20page%20correction">
									let me know
								</FancyLink>
								.
							</p>
							<Link
								href="#top"
								className="inline-block text-sm text-blue hover:underline"
								onClick={(e) => {
									e.preventDefault();
									fastScrollToTop();
								}}
							>
								Back to top ↑
							</Link>
						</div>
					</>
				) : (
					<p className="prose max-w-none text-center text-textSubdued py-12">
						No books found yet. Run{" "}
						<code>npm run build:books</code> after adding book links to sketch
						articles.
					</p>
				)}
			</div>
		</>
	);
};

export async function getStaticProps() {
	return {
		props: {
			books: booksIndex.books ?? [],
		},
	};
}

export default Books;
