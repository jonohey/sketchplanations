import { track } from "@vercel/analytics";
import FancyLink from "components/FancyLink";
import TextHeader from "components/TextHeader";
import booksIndex from "data/books-index.json";
import { fastScrollToTop, pageTitle } from "helpers";
import Head from "next/head";
import Link from "next/link";
import classNames from "classnames";

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
		rel="noopener noreferrer"
		className={className}
		onClick={() => trackBooksBuyLink(book, location)}
		{...props}
	>
		{children}
	</a>
);

const BookRow = ({ book }) => {
	const hasCover = Boolean(book.thumbnail);

	return (
		<article
			className={classNames(
				styles.bookRow,
				hasCover && styles.bookRowWithCover,
			)}
		>
			{hasCover ? (
				<BookBuyLink
					book={book}
					className={styles.coverLink}
					location="cover"
					aria-label={`Buy ${book.title}`}
				>
					<img
						src={book.thumbnail}
						alt=""
						className="w-20 h-[7.5rem] sm:w-24 sm:h-36 object-cover rounded shadow-sm"
					/>
				</BookBuyLink>
			) : null}

			<div className={`${styles.bookContent} prose max-w-none`}>
				<div className={styles.bookHeading}>
					<h2 className="mb-0">
						<BookBuyLink
							book={book}
							className="text-text no-underline font-semibold hover:text-blue"
							location="title"
						>
							{book.title}
						</BookBuyLink>
					</h2>
					{book.author ? (
						<p className="text-textSubdued mt-1 mb-0">
							by{" "}
							<BookBuyLink
								book={book}
								className="text-textSubdued no-underline hover:text-blue"
								location="author"
							>
								{book.author}
							</BookBuyLink>
						</p>
					) : null}
				</div>

				{book.note ? <p className="my-0">{book.note}</p> : null}

				<div className={styles.referencedSection}>
					<p className="mb-2 mt-0">Referenced in</p>
					<ul className="mt-0 mb-0">
						{book.sketches.map((sketch) => (
							<li key={sketch.uid}>
								<FancyLink href={`/${sketch.uid}`}>{sketch.title}</FancyLink>
							</li>
						))}
					</ul>
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

				<div className={`not-prose ${styles.backToTop}`}>
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
			</div>
		</article>
	);
};

const Books = ({ books }) => {
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
			<div id="top" className="max-w-3xl mx-auto px-5 pb-16 scroll-mt-24">
				<div className="prose max-w-none text-center pt-12 pb-6">
					<div className="not-prose">
						<TextHeader>Books</TextHeader>
					</div>
					<p className="lead mx-auto max-w-2xl mb-0">
						Many sketches are of ideas I learned from reading books. Here are
						the books that taught me the content in Sketchplanations.
					</p>
				</div>

				<p className="prose max-w-none text-sm mb-4">
					This list is automatically generated from book links in my sketch
					articles. If something looks wrong, please{" "}
					<FancyLink href="mailto:jono.hey@gmail.com?subject=Books%20page%20correction">
						let me know
					</FancyLink>
					.
				</p>

				<p className="prose max-w-none text-sm mb-6">
					When you buy through links on this page, I may earn an affiliate
					commission at no extra cost to you. Thanks for supporting the site.
				</p>

				{books.length > 0 ? (
					<ul className={styles.bookList}>
						{books.map((book) => (
							<li key={book.title}>
								<BookRow book={book} />
							</li>
						))}
					</ul>
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
