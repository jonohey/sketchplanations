import { track } from '@vercel/analytics';
import { ChevronRight, ExternalLink } from "lucide-react";
import { RoughNotation } from "react-rough-notation";
import { Cards } from "./Cards";
import FancyLink from "./FancyLink";
import SubscribeInline from "./SubscribeInline";

import styles from "./Footer.module.css";

const Nav = () => (
	<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 lg:text-center gap-x-12 gap-y-2 items-start">
		<FancyLink href="/">Home</FancyLink>
		<FancyLink href="/search">Search</FancyLink>
		<FancyLink href="/categories">Categories</FancyLink>
		<FancyLink
			href="/big-ideas-little-pictures"
			onClick={() => {
					track('Book-page-link', { location: 'footer' });
			}}
		>
				Book!
		</FancyLink>
		<FancyLink
			href="https://sketchplanations.substack.com/subscribe"
			target="_blank"
			rel="noopener noreferrer"
			onClick={() => {
				track('Subscribe', { location: 'footer' });
			}}
		>
			<span className="inline-flex items-center gap-2">
				<span>Subscribe</span>
				<ExternalLink size={16} className="inline" />
			</span>
		</FancyLink>
		<FancyLink
			href="https://podcast.sketchplanations.com"
			target="_blank"
			rel="noreferrer"
			onClick={() => {
					track('Podcast-site-link', { location: 'footer' });
			}}
		>
			<span className="inline-flex items-center gap-2">
				<span>Podcast</span>
				<ExternalLink size={16} className="inline" />
			</span>
		</FancyLink>
		<FancyLink
			href="https://www.redbubble.com/people/sketchplanator/explore?asc=u&page=1&sortOrder=top%20selling"
			target="_blank"
			rel="noreferrer"
			onClick={() => {
					track('Shop', { location: 'footer' });
			}}
		>
			<span className="inline-flex items-center gap-2">
				<span>Shop</span>
				<ExternalLink size={16} className="inline" />
			</span>
		</FancyLink>
		<FancyLink href="/about">About</FancyLink>
		<FancyLink href="/archive">Archive</FancyLink>
		<FancyLink href="/licence">Licence</FancyLink>
	</div>
);

const categories = [
	{
		title: "Wellbeing",
		uid: "wellbeing",
	},
	{
		title: "Productivity",
		uid: "productivity",
	},
	{
		title: "Cognitive bias",
		uid: "cognitive-bias",
	},
	{
		title: "Design",
		uid: "design",
	},
	{
		title: "Science",
		uid: "science",
	},
	{
		title: "Motivation",
		uid: "motivation",
	},
	{
		title: "Writing",
		uid: "writing",
	},
	{
		title: "Coffee",
		uid: "coffee",
	},
	{
		title: "Behavioral economics",
		uid: "behavioral-economics",
	},
	{
		title: "Quotes",
		uid: "quote",
	},
	{
		title: "Drawing",
		uid: "drawing",
	},
	{
		title: "Nature",
		uid: "nature",
	},
];

const Footer = () => {
	return (
		<footer className={styles.root}>
			<div id="footer-categories" className="pt-6 sm:pt-10 px-[var(--edgeInset)]">
				<div className="max-w-screen-xl mx-auto">
					<div className="mb-3 text-xl font-semibold">Explore more</div>
					<div className="prose mb-6">
						<p className="text-balance">
							The sketches cover many topics. Here are some of my favourites:
						</p>
					</div>
					<div className="columns-2 md:columns-3 lg:columns-5 -my-1">
						{categories.map(({ title, uid }) => {
							return (
								<div key={uid} className="block break-inside-avoid py-1">
									<FancyLink href={`/categories/${uid}`}>{title}</FancyLink>
								</div>
							);
						})}
					</div>
					<FancyLink
						href="/categories"
						className="inline-block hover:text-blue mt-6"
					>
						<span className="inline-flex flex-row gap-x-1 items-center">
							More topics
							<ChevronRight size={16} />
						</span>
					</FancyLink>
				</div>
			</div>

			<div id="footer-subscribe-inline" className="border-t border-borderFooter pt-6 sm:pt-10 px-[var(--edgeInset)]">
				<div className="grid sm:grid-cols-2 gap-12 max-w-screen-xl mx-auto items-center">
					<Cards />
					<div className="grid gap-y-8 items-start">
						<SubscribeInline />
					</div>
				</div>
			</div>

			<div className="text-center text-sm px-[var(--edgeInset)] py-4">
				As an Amazon Associate I earn from qualifying purchases.
			</div>

			<div id="footer-nav-links" className="border-t border-borderFooter pt-6 sm:pt-10 px-[var(--edgeInset)]">
				<Nav />
			</div>

			<div id="feedback-link" className="text-center pt-4 text-sm relative">
				<RoughNotation
					type="highlight"
					show={true}
					color="var(--color-paper)"
					iterations={1}
					strokeWidth={1}
					animate={true}
				>
					<a 
						href="https://forms.gle/Htu1Zy1MdnpYGSV98"
						target="_blank"
						rel="noreferrer"
						className="text-blue"
						onClick={() => {
							track('Feedback-form', { location: 'footer' });
						}}
					>
						Leave feedback
					</a>
				</RoughNotation>
			</div>

			<div className="text-center pt-4 text-sm text-gray-600">
				Combining 🧠 curiosity, ♥️ heart, and ✍️ art since 2013
			</div>
		</footer>
	);
};

export default Footer;