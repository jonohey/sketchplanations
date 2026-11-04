import { track } from "@vercel/analytics";
import classNames from "classnames";
import booksIndex from "data/books-index.json";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import styles from "./books.module.css";

import BackToTopButton from "components/BackToTopButton";
import FancyLink from "components/FancyLink";
import TextHeader from "components/TextHeader";
import { fastScrollToTop, pageTitle } from "helpers";

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

// Covers display at 80x120 (128x192 for noted rows from 640px up). Next's
// optimiser resizes them to the 2x size and serves WebP/AVIF, which is crisper
// and lighter than letting the browser downscale the ~300px source.
const BookCover = ({ book, noted, priority }) => {
	const coverClassName = classNames(styles.coverImage, "rounded");

	return (
		<BookBuyLink
			book={book}
			className={styles.coverLink}
			location="cover"
			aria-label={`Buy ${book.title}`}
		>
			{book.thumbnail ? (
				<Image
					src={book.thumbnail}
					alt=""
					width={128}
					height={192}
					sizes={noted ? "(min-width: 640px) 128px, 80px" : "80px"}
					quality={90}
					loading={priority ? "eager" : "lazy"}
					fetchPriority={priority ? "high" : "auto"}
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

const NOTE_LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

// Notes are plain prose; `[text](https://url)` becomes an external link.
const NoteText = ({ text }) => {
	const parts = text.split(NOTE_LINK);

	return parts.map((part, i) => {
		if (i % 3 === 0) return part;
		if (i % 3 === 2) return null;
		return (
			<FancyLink
				key={i}
				as="a"
				href={parts[i + 1]}
				target="_blank"
				rel="noopener noreferrer"
			>
				{part}
			</FancyLink>
		);
	});
};

const BuyButton = ({ book }) => (
	<BookBuyLink
		book={book}
		className="btn-outline inline-block no-underline"
		location="button"
	>
		Buy
	</BookBuyLink>
);

const BookRow = ({ book, priority = false }) => {
	const hasNote = Boolean(book.note);
	const cover = <BookCover book={book} noted={hasNote} priority={priority} />;

	return (
		<article
			className={classNames(styles.bookRow, hasNote && styles.bookRowNoted)}
		>
			{hasNote ? (
				<div className={styles.coverColumn}>
					{cover}
					<div className={`not-prose ${styles.buyAction} ${styles.coverBuy}`}>
						<BuyButton book={book} />
					</div>
				</div>
			) : (
				cover
			)}

			<div className={styles.bookContent}>
				<BookTitle book={book} />

				{hasNote ? (
					<p className={styles.bookNote}>
						<NoteText text={book.note} />
					</p>
				) : null}

				<div className={styles.bookMeta}>
					<div className={styles.referencedSection}>
						<p className={styles.referencedLabel}>Mentioned in</p>
						<ul className={styles.sketchList}>
							{book.sketches.map((sketch) => (
								<SketchLink key={sketch.uid} sketch={sketch} />
							))}
						</ul>
					</div>

					<div className={`not-prose ${styles.buyAction}`}>
						<BuyButton book={book} />
					</div>
				</div>
			</div>
		</article>
	);
};

// Alphabetical order ignores a leading "The", "A" or "An".
const sortKey = (title) => title.replace(/^(the|an|a)\s+/i, "");

const Books = ({ books }) => {
	// Favourites get the "Start here" section; noted books marked
	// `favourite: false` sit in "More books" as full-width rows.
	const withNotes = books.filter(
		(book) => book.note && book.favourite !== false,
	);
	const rest = books
		.filter((book) => !(book.note && book.favourite !== false))
		.sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title)));

	// Alphabetical runs of compact books share the two-column grid; a book with
	// a note breaks it into a full-width row, so the order reads straight through.
	const moreBooks = [];
	for (const book of rest) {
		const last = moreBooks[moreBooks.length - 1];
		if (book.note) {
			moreBooks.push({ noted: true, books: [book] });
		} else if (last && !last.noted) {
			last.books.push(book);
		} else {
			moreBooks.push({ noted: false, books: [book] });
		}
	}

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
			<BackToTopButton />
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
						At the top are favourites, with a few words from me about some of
						them. Further down are more books I&apos;ve drawn on, from
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
						{withNotes.length > 0 ? (
							<section aria-labelledby="start-here">
								<h2 id="start-here" className={styles.sectionHeading}>
									Start here
								</h2>
								<p className={styles.sectionIntro}>
									Favourites from the sketches, and why I love them.
								</p>
								<ul className={styles.noteList}>
									{withNotes.map((book, index) => (
										<li key={book.title}>
											{/* The first covers are above the fold: load them eagerly */}
											<BookRow book={book} priority={index < 2} />
										</li>
									))}
								</ul>
							</section>
						) : null}

						{rest.length > 0 ? (
							<section aria-labelledby="more-books">
								<h2 id="more-books" className={styles.sectionHeading}>
									More books
								</h2>
								{moreBooks.map((group) => (
									<ul
										key={group.books[0].title}
										className={group.noted ? styles.noteList : styles.bookList}
									>
										{group.books.map((book) => (
											<li key={book.title}>
												<BookRow book={book} />
											</li>
										))}
									</ul>
								))}
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
						No books found yet. Run <code>npm run build:books</code> after
						adding book links to sketch articles.
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
