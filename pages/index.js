import * as prismic from "@prismicio/client";
import { track } from "@vercel/analytics";
import Head from "next/head";

import FancyLink from "components/FancyLink";
import HomeCategoryCarousels from "components/HomeCategoryCarousel";
import { HOME_CAROUSEL_CATEGORIES } from "helpers/homeCarouselCategories";
import { getTagDocumentBySlug } from "helpers/getTagDocumentBySlug";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import bigIdeasLittlePicturesCoverTransparentImage from "../images/big-ideas-little-pictures-cover-transparent.png";
import styles from "./index.module.css";

const SubscribeFullPlaceholder = () => (
	<div
		className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center"
		id="substack-subscribe-strip"
	>
		<div
			aria-hidden="true"
			style={{
				width: 480,
				height: 320,
				maxWidth: "100%",
				border: "1px solid #EEE",
				background: "white",
			}}
		/>
	</div>
);

const SubscribeFull = dynamic(() => import("components/SubscribeFull"), {
	ssr: false,
	loading: SubscribeFullPlaceholder,
});

import { client } from "services/prismic";

const SKETCH_CAROUSEL_FETCH = [
	"sketchplanation.title",
	"sketchplanation.image",
	"sketchplanation.published_at",
];

const mapSketchForCarousel = (doc) => ({
	uid: doc.uid,
	title: doc.data.title,
	image: doc.data.image,
	publishedAt: doc.data.published_at ?? null,
});

const Home = ({ carouselRows }) => {
	const bookSection = (
		<section className={styles.section} aria-label="Book promotion" id="big-ideas-little-pictures-strip">
			<div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12">
				<div className="w-full md:w-1/2 relative">
					<div className={styles.bookSection}>
						<Link
							href="/big-ideas-little-pictures"
							className="block"
							onClick={() => {
								track('Book-page-link', { location: 'home-book-image' });
							}}
							aria-label="View Big Ideas Little Pictures book details - 5-star rated on Amazon"
						>
							<Image
								src={bigIdeasLittlePicturesCoverTransparentImage}
								alt="Big Ideas Little Pictures Book"
								className={styles.bookImage}
								placeholder="blur"
							/>
							<div className={styles.quoteCircle}>
								<div className={styles.quoteText}>
									<p className="font-semibold">
										This is such<br />
										a cool book.<br />
										<span className={styles.quoteAttribution}>— Bill Gates</span>
									</p>
								</div>
							</div>
						</Link>
					</div>
				</div>
				<div className="w-full md:w-1/2 prose">
					<Link
						href="/big-ideas-little-pictures"
						className="no-underline hover:no-underline"
						onClick={() => {
							track('Book-page-link', { location: 'home-book-text' });
						}}
					>
						<h2 className="mt-2 sm:mt-6 hover:text-blue">In a Book: Big Ideas Little Pictures</h2>
					</Link>
					<div>
						<p className="font-bold text-xl">
							5-star rated on Amazon!
						</p>
						<p>
							Absorb big ideas with crystal-clear understanding through this collection of 135 visual explanations.
							Including 24 exclusive new sketches and enhanced versions of classic favourites,
							each page shares life-improving ideas through beautifully simple illustrations.
						</p>
						<p>Perfect for curious minds and visual learners alike.</p>
						<Link
							href="/big-ideas-little-pictures"
							className="btn-primary inline-block px-8"
							onClick={() => {
								track('Book-page-link', { location: 'home-book-text-button' });
							}}
						>
							See inside the book
						</Link>
					</div>
				</div>
			</div>
		</section>
	);

	return (
		<>
			<Head>
				<meta
					name="description"
					content="Sketchplanations explains the world one sketch at a time. Discover clear, simple sketches that break down ideas from science, creativity, psychology, and more. Explore recent sketches, search for topics, and share your favourites. Start here."
				/>
				<link rel="canonical" href="https://sketchplanations.com" />
				
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "Book",
							"name": "Big Ideas Little Pictures: Explaining the world one sketch at a time",
							"author": {
								"@type": "Person",
								"name": "Jono Hey"
							},
							"publisher": {
								"@type": "Organization",
								"name": "Sketchplanations"
							},
							"review": {
								"@type": "Review",
								"author": {
									"@type": "Person",
									"name": "Bill Gates"
								},
								"reviewBody": "This is such a cool book. The range of Jono's knowledge is astounding, and so is his ability to digest complex ideas into deceptively simple drawings. You'll learn something on every page—and be entertained too."
							},
							"aggregateRating": {
								"@type": "AggregateRating",
								"ratingValue": "5",
								"bestRating": "5",
								"ratingCount": 88,
								"reviewCount": 88
							},
							"image": "https://sketchplanations.com/images/big-ideas-little-pictures-cover-transparent.png",
							"description": "Transform complex ideas into crystal-clear understanding with this collection of 135 visual explanations. Including 24 exclusive new sketches and enhanced versions of classic favourites, each page shares life-improving ideas through beautifully simple illustrations.",
							"isbn": "9781956403572",
							"numberOfPages": 288,
							"inLanguage": "en",
							"bookFormat": "Hardcover"
						})
					}}
				/>
			</Head>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" id="hero">
				<div className="prose sm:prose-lg lg:prose-xl mx-auto text-center">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
						Explaining the world<span className="hidden md:inline"><br /></span> one sketch at a time
					</h1>
					<p className="lead text-base sm:text-lg lg:text-xl mb-2">
						Have great conversations about ideas through simple and insightful sketches.
						<span className="hidden sm:inline">{' '}
							Visual explanations that are fast to read, fun to share, and hard to forget.
						</span>
					</p>
				</div>
			</div>

			<SubscribeFull />

			<section className={styles.section} aria-label="About information" id="about-strip">
				<div className="prose max-w-none px-0 sm:px-12 lg:px-24 mb-12">
					<h2>Hi, I&apos;m Jono 👋</h2>
					<p>
						I&apos;m an author and illustrator creating one of the world&apos;s largest libraries of hand-drawn sketches explaining the world—sketch-by-sketch.
					</p>
					<p>
						Sketchplanations have been shared millions of times and used in books, articles, classrooms, and more. <FancyLink href="/about">Learn more about the project</FancyLink>, <FancyLink href="/search">search for a sketch you like</FancyLink>, or browse by topic below.
					</p>
				</div>
			</section>

			<div className="mt-4 sm:mt-8">
				<HomeCategoryCarousels rows={carouselRows} interlude={bookSection} />
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 my-12 flex flex-col items-center" id="see-more-strip">
				<div className="text-center mt-4 mb-8">
					<FancyLink href="/search" className={styles.footerLink}>
						Search
					</FancyLink>
					<span className="mx-2">·</span>
					<FancyLink href="/categories" className={styles.footerLink}>
						Categories
					</FancyLink>
					<span className="mx-2">·</span>
					<FancyLink href="/archive" className={styles.footerLink}>
						Archive
					</FancyLink>
					<span className="mx-2">·</span>
					<FancyLink href="/list" className={styles.footerLink}>
						List
					</FancyLink>
				</div>
				<div className={styles.ident}>
					<Image
						src="/logo.svg"
						alt="Sketchplanations"
						className={styles.ident__svg}
						width={520}
						height={84}
						sizes="(max-width: 768px) 150px, 200px"
					/>
				</div>
			</div>

		</>
	);
};

export const getStaticProps = async () => {
	const recent = await client.getByType("sketchplanation", {
		orderings: [{ field: "my.sketchplanation.published_at", direction: "desc" }],
		pageSize: 20,
		fetch: SKETCH_CAROUSEL_FETCH,
	});

	const categoryRows = await Promise.all(
		HOME_CAROUSEL_CATEGORIES.map(async ({ slug, label }) => {
			const tagDoc = await getTagDocumentBySlug(slug);
			if (!tagDoc) return null;

			const result = await client.getByType("sketchplanation", {
				filters: [
					prismic.filter.at("document.type", "sketchplanation"),
					prismic.filter.at("my.sketchplanation.tags.tag", tagDoc.id),
				],
				orderings: [
					{ field: "my.sketchplanation.published_at", direction: "desc" },
				],
				pageSize: 20,
				fetch: SKETCH_CAROUSEL_FETCH,
			});

			if (result.results.length === 0) return null;

			return {
				kind: "category",
				label,
				slug,
				viewAllHref: `/categories/${slug}`,
				sketches: result.results.map(mapSketchForCarousel),
			};
		}),
	);

	const carouselRows = [];
	if (recent.results.length > 0) {
		carouselRows.push({
			kind: "recent",
			label: "Recent sketches",
			slug: null,
			viewAllHref: "/archive",
			sketches: recent.results.map(mapSketchForCarousel),
		});
	}
	carouselRows.push(...categoryRows.filter(Boolean));

	return { props: { carouselRows } };
};

export default Home;
