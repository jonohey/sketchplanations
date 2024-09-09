import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

import bigIdeasLittlePicturesImage from "images/bigideaslittlepictures.jpg";
import podcastImage from "images/podcast.jpg";
import SubscribeInline from "./SubscribeInline";
import FancyLink from "./FancyLink";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const Nav = () => (
	<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 lg:text-center gap-x-12 gap-y-1 items-start">
		<FancyLink href="/">Home</FancyLink>
		<FancyLink href="/big-ideas-little-pictures">Book!</FancyLink>
		<FancyLink
			href="https://podcast.sketchplanations.com"
			target="_blank"
			rel="noreferrer"
		>
			<span className="flex flex-row gap-x-1 items-center">
				Podcast
				<ExternalLink size={16} />
			</span>
		</FancyLink>
		<FancyLink href="/subscribe">Subscribe</FancyLink>
		<FancyLink href="/about">About</FancyLink>
		<FancyLink
			href="https://www.redbubble.com/people/sketchplanator/explore?asc=u&page=1&sortOrder=top%20selling"
			target="_blank"
			rel="noreferrer"
		>
			<span className="flex flex-row gap-x-1 items-center">
				Shop
				<ExternalLink size={16} />
			</span>
		</FancyLink>
		<FancyLink href="/categories">Categories</FancyLink>
		<FancyLink href="/archive">Archive</FancyLink>
	</div>
);

const Cards = () => (
	<div className={styles.cards}>
		<Card
			href="/big-ideas-little-pictures"
			imageSrc={bigIdeasLittlePicturesImage}
			alt="Big Ideas Little Pictures"
			content={
				<>
					Sketchplanations is now a book! I think you’ll love{" "}
					<FancyLink href="/big-ideas-little-pictures">
						Big Ideas Little Pictures
					</FancyLink>
				</>
			}
		/>
		<Card
			href="/thanks"
			content={
				<>
					Thanks to <FancyLink href="/thanks">my Patrons</FancyLink> for
					enabling me to keep creating Sketchplanations 🙏
				</>
			}
		/>
		<Card
			href="https://podcast.sketchplanations.com/"
			imageSrc={podcastImage}
			alt="Big Ideas Little Pictures"
			content={
				<>
					Prefer to listen to the ideas on your commute or while doing chores? I
					don’t blame you.{" "}
					<FancyLink
						href="https://podcast.sketchplanations.com/"
						target="_blank"
						rel="noreferrer"
					>
						<span className="inline-flex flex-row gap-x-1 items-center">
							Listen to the podcast
							<ExternalLink size={16} />
						</span>
					</FancyLink>
				</>
			}
		/>
	</div>
);

const Card = ({ href, imageSrc, alt, content }) => (
	<div className={styles.card}>
		{imageSrc && (
			<Link href={href}>
				<Image src={imageSrc} alt={alt} width={114} className="w-full" />
			</Link>
		)}
		<p>{content}</p>
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
		<footer className="bg-bg pb-36 grid gap-y-12 border-t border-border">
			<div className="pt-6 sm:pt-10 px-6">
				<div className="max-w-screen-xl mx-auto">
					<div className="mb-3 text-xl font-semibold">Explore more</div>
					<div className="prose mb-6">
						<p className="text-subduedText">
							The sketches cover all sorts of topics. Explore some common themes
							to find what interests you:
						</p>
					</div>
					<div className="sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 -my-1">
						{categories.map(({ title, uid }) => {
							return (
								<div key={uid} className="block break-inside-avoid py-1">
									<FancyLink href={`/categories/${uid}`}>{title}</FancyLink>
								</div>
							);
						})}
						<FancyLink
							href="/categories"
							className="text-subduedText hover:text-blue"
						>
							<div className="inline-flex flex-row gap-x-1 items-center">
								More <ChevronRight size={16} />
							</div>
						</FancyLink>
					</div>
				</div>
			</div>

			<div className="border-t border-border pt-6 sm:pt-10 px-6">
				<div className="grid sm:grid-cols-2 gap-12 max-w-screen-xl mx-auto items-center">
					<Cards />
					<div className="grid gap-y-8 items-start">
						<SubscribeInline doc={subscribeInlineDoc} />
						{/* <p className="text-subduedText">
							<b className="font-semibold">Looking to use a Sketchplanation?</b>{" "}
							Please do! See the <FancyLink href="/licence">licence</FancyLink>{" "}
							for details.
						</p> */}
					</div>
				</div>
			</div>

			<div className="border-t border-border pt-6 sm:pt-10 px-6">
				<Nav />
			</div>
		</footer>
	);
};

export default Footer;
