import { track } from '@vercel/analytics';
import dynamic from "next/dynamic";
import Head from "next/head";

import FancyLink from "components/FancyLink";
import SubscribeInline from "components/SubscribeInline";
import Image from "next/image";
import Link from "next/link";
import bigIdeasLittlePicturesCoverTransparentImage from "../images/big-ideas-little-pictures-cover-transparent.png";
import styles from "./index.module.css";

import { client } from "services/prismic";

const Sketchplanation = dynamic(() => import("../components/Sketchplanation"));

const Home = ({ sketchplanations, subscribeInlineDoc }) => {
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
						Explaining the world one sketch at a time
					</h1>
					<p className="lead text-base sm:text-lg lg:text-xl mb-2">
						Simplifying complex ideas through fun and insightful sketches.
						<span className="hidden sm:inline">{' '}
							Explore topics from science, creativity, psychology, and more
							explained in pictures.
						</span>
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8" id="subscribe-strip">
				<div className="max-w-xl mx-auto text-center">
					<SubscribeInline doc={subscribeInlineDoc} />
				</div>
			</div>

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
							<h2 className="mt-2 sm:mt-6 hover:text-blue">Big Ideas Little Pictures: Explaining the world one sketch at a time</h2>
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

			<section className={styles.section} aria-label="About information" id="about-strip">
				<div className="flex flex-col md:flex-row items-start mb-12 prose max-w-none">
					<div className="w-full md:w-1/2">
						<div className="px-0 sm:px-12 lg:px-24">
							<h2>Hi, I'm Jono 👋</h2>
							<p>
								I'm an author and illustrator creating one of the world's largest libraries of hand-drawn sketches explaining the world—sketch-by-sketch.
							</p>
							<p>
								Sketchplanations have been shared millions of times and used in books, articles, classrooms, and more. <FancyLink href="/about">Learn more about the project</FancyLink>, <FancyLink href="/search">search for a sketch you like</FancyLink>, or see recent sketches below.
							</p>
						</div>
					</div>
					<div className="w-full md:w-1/2">
						<div className="px-0 sm:px-12 lg:px-24">
							<h3>Explore sketches for:</h3>
							<ul className="columns-1 sm:columns-2 gap-x-8 list-disc ml-4 [&>li]:mt-[0.25em] [&>li:first-child]:mt-0">
								<li><FancyLink href="/categories/learning">Teachers</FancyLink></li>
								<li><FancyLink href="/categories/management">Managers & Leaders</FancyLink></li>
								<li><FancyLink href="/categories/writing">Writers</FancyLink></li>
								<li><FancyLink href="/categories/software">Developers</FancyLink></li>
								<li><FancyLink href="/categories/entrepreneurship">Entrepreneurs</FancyLink></li>
								<li><FancyLink href="/categories/product-management">Product managers</FancyLink></li>
								<li><FancyLink href="/categories/parenting">Parents</FancyLink></li>
								<li><FancyLink href="/categories/data">Data scientists</FancyLink></li>
								<li><FancyLink href="/categories/marketing">Marketers</FancyLink></li>
								<li><FancyLink href="/categories/design">Designers</FancyLink></li>
								<li><FancyLink href="/categories">And loads more...</FancyLink></li>
							</ul>
						</div>
					</div>
				</div>
			</section>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 mt-12 sm:mt-16 lg:mt-20">
				<h2 className="prose prose-xl mx-auto text-center">Recent sketches</h2>
			</div>

			<div className={styles.sketchplanations} id="recent-sketches">
				{sketchplanations.results.map((sketchplanation, index) => (
					<Sketchplanation
						key={sketchplanation.uid}
						sketchplanation={sketchplanation}
						priority={index === 0}
					/>
				))}
			</div>

			<div className="container mx-auto px-4 sm:px-6 lg:px-8 my-12 flex flex-col items-center" id="see-more-strip">
				<Link
					href="/archive"
					className="btn-primary w-full max-w-96 inline-block text-center py-2 px-4 mb-4"
				>
					See more
				</Link>
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

export const getServerSideProps = async () => {
	const [sketchplanations, subscribeInlineDoc] = await Promise.all([
		client.getByType("sketchplanation", {
			orderings: [{ field: "my.sketchplanation.published_at", direction: "desc" }],
			pageSize: 6,
		}),
		client.getSingle("subscribe_inline")
	]);

	return { props: { sketchplanations, subscribeInlineDoc } };
};

export default Home;
