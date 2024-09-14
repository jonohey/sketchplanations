import { ExternalLink } from "lucide-react";
import { Cards } from "./Cards";
import SubscribeInline from "./SubscribeInline";
import FancyLink from "./FancyLink";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import styles from "./Footer.module.css";

const Nav = () => (
	<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 lg:text-center gap-x-12 gap-y-1 items-start">
		<FancyLink href="/">Home</FancyLink>
		<FancyLink href="/big-ideas-little-pictures">Book!</FancyLink>
		<FancyLink
			href="https://podcast.sketchplanations.com"
			target="_blank"
			rel="noreferrer"
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
		>
			<span className="inline-flex items-center gap-2">
				<span>Shop</span>
				<ExternalLink size={16} className="inline" />
			</span>
		</FancyLink>
		<FancyLink href="/categories">Categories</FancyLink>
		<FancyLink href="/archive">Archive</FancyLink>
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
		title: "Science",
		uid: "science",
	},
	{
		title: "Framework",
		uid: "framework",
	},
	{
		title: "Words",
		uid: "words",
	},
	{
		title: "Food and drink",
		uid: "food-and-drink",
	},
	{
		title: "Behavioral economics",
		uid: "behavioral-economics",
	},
	{
		title: "Quotes",
		uid: "quotes",
	},
	{
		title: "Ideas",
		uid: "ideas",
	},
	{
		title: "Drawing",
		uid: "drawing",
	},
	{
		title: "Nature",
		uid: "nature",
	},
	{
		title: "Weather",
		uid: "weather",
	},
	{
		title: "What’s the difference between",
		uid: "whats-the-difference-between",
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
							The sketches cover all sorts of topics. Here are some common
							themes to find what interests you:
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
