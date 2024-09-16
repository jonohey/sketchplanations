import { track } from '@vercel/analytics';
import { ChevronRight, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Cards } from "./Cards";
import FancyLink from "./FancyLink";
import SubscribeInline from "./SubscribeInline";

import styles from "./Footer.module.css";

const Nav = () => (
	<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 lg:text-center gap-x-12 gap-y-2 items-start">
		<FancyLink href="/">Home</FancyLink>
		<FancyLink
			href="/big-ideas-little-pictures"
			onClick={() => {
					track('Book-page-link', { location: 'footer' });
			}}
		>
				Book!
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
		<FancyLink href="/subscribe">Subscribe</FancyLink>
		<FancyLink href="/about">About</FancyLink>
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
		<FancyLink href="/categories">Categories</FancyLink>
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
	const [subscribeInlineDoc, setSubscribeInlineDoc] = useState(null);

	useEffect(() => {
		fetch("/api/subscribeInlineDoc")
			.then((res) => res.json())
			.then(setSubscribeInlineDoc);
	}, []);

	return (
		<footer className={styles.root}>
			<div className="pt-6 sm:pt-10 px-[var(--edgeInset)]">
				<div className="max-w-screen-xl mx-auto">
					<div className="mb-3 text-xl font-semibold">Explore more</div>
					<div className="prose mb-6">
						<p className="text-textSubdued text-balance ">
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
						className="inline-block text-textSubdued hover:text-blue mt-6"
					>
						<span className="inline-flex flex-row gap-x-1 items-center">
							More topics
							<ChevronRight size={16} />
						</span>
					</FancyLink>
				</div>
			</div>

			<div className="border-t border-borderFooter pt-6 sm:pt-10 px-[var(--edgeInset)]">
				<div className="grid sm:grid-cols-2 gap-12 max-w-screen-xl mx-auto items-center">
					<Cards />
					<div className="grid gap-y-8 items-start">
						<SubscribeInline doc={subscribeInlineDoc} />
						{/* <p className="text-textSubdued">
							<b className="font-semibold">Looking to use a Sketchplanation?</b>{" "}
							Please do! See the <FancyLink href="/licence">licence</FancyLink>{" "}
							for details.
						</p> */}
					</div>
				</div>
			</div>

			<div className="border-t border-borderFooter pt-6 sm:pt-10 px-[var(--edgeInset)]">
				<Nav />
			</div>
		</footer>
	);
};

export default Footer;
