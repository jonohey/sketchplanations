import FancyLink from "components/FancyLink";
import TextHeader from "components/TextHeader";
import booksIndex from "data/books-index.json";
import { pageTitle } from "helpers";
import Head from "next/head";

import styles from "./books.module.css";

const BookCover = ({ book }) => {
	if (book.thumbnail) {
		return (
			<img
				src={book.thumbnail}
				alt=""
				className="w-20 h-[7.5rem] sm:w-24 sm:h-36 object-cover rounded shadow-sm"
			/>
		);
	}

	const initial = book.title?.trim()?.[0]?.toUpperCase() ?? "?";

	return (
		<div className={styles.coverPlaceholder} aria-hidden="true">
			<span className={styles.coverInitial}>{initial}</span>
		</div>
	);
};

const BookRow = ({ book }) => {
	return (
		<article className={styles.bookRow}>
			<a
				href={book.url}
				target="_blank"
				rel="noopener noreferrer"
				className={styles.coverLink}
				aria-label={`Find ${book.title}`}
			>
				<BookCover book={book} />
			</a>

			<div className={`${styles.bookContent} prose max-w-none`}>
				<div>
					<h2 className="mb-0">
						<a
							href={book.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-text no-underline font-semibold hover:text-blue"
						>
							{book.title}
						</a>
					</h2>
					{book.author ? (
						<p className="text-textSubdued mt-1 mb-0">by {book.author}</p>
					) : null}
				</div>

				{book.note ? (
					<p className={`${styles.bookNote} not-prose`}>{book.note}</p>
				) : null}

				<div>
					<p className="mb-2">Referenced in</p>
					<ul>
						{book.sketches.map((sketch) => (
							<li key={sketch.uid}>
								<FancyLink href={`/${sketch.uid}`}>{sketch.title}</FancyLink>
							</li>
						))}
					</ul>
				</div>

				<div className="not-prose">
					<a
						href={book.url}
						target="_blank"
						rel="noopener noreferrer"
						className="btn-outline inline-block no-underline"
					>
						Find the book
					</a>
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
					content="Books that taught the ideas behind Sketchplanations — a reading list to learn more from the sketches."
				/>
				<link rel="canonical" href="https://sketchplanations.com/books" />
				<meta property="og:title" content="Books" />
				<meta
					property="og:description"
					content="Books that taught the ideas behind Sketchplanations — a reading list to learn more from the sketches."
				/>
				<meta property="og:url" content="https://sketchplanations.com/books" />
				<meta name="twitter:card" content="summary" />
			</Head>
			<div className="max-w-3xl mx-auto px-5 pb-16">
				<div className="prose max-w-none text-center pt-12 pb-8">
					<div className="not-prose">
						<TextHeader>Books</TextHeader>
					</div>
					<p className="lead mx-auto max-w-2xl">
						Many sketches are of ideas I learned from reading books. Here are
						the books that taught me the content in Sketchplanations and a
						great start to learn more.
					</p>
				</div>

				<p className="prose max-w-none text-sm mb-8">
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
