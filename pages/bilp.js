import FancyLink from "components/FancyLink";
import TextHeader from "components/TextHeader";

import bookImg from "images/book.jpg";
import Image from "next/image";
import Link from "next/link";
import { Tab } from "react-aria-components";
import { TabPanel } from "react-aria-components";
import { TabList } from "react-aria-components";
import { Tabs } from "react-aria-components";
import { RoughNotation } from "react-rough-notation";
import { parse } from "node-html-parser";
import Debug from "components/Debug";
import Shiitake from "shiitake";
import { ChevronRight } from "lucide-react";

const StarIcon = ({ filled, size = 16 }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill={filled ? "currentColor" : "none"}
		stroke="currentColor"
		strokeWidth="2"
	>
		<title>Rating</title>
		<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
	</svg>
);

const buyLinksByCountry = {
	US: [
		{
			link: "https://www.amazon.com/dp/1984855658",
			label: "Amazon.com",
		},
	],
	Canada: [
		{
			link: "https://www.amazon.ca/dp/1984855658",
			label: "Amazon.ca",
		},
	],
	UK: [
		{
			link: "https://www.amazon.co.uk/dp/1984855658",
			label: "Amazon.co.uk",
		},
	],
	Europe: [
		{
			link: "https://www.amazon.co.uk/dp/1984855658",
			label: "Amazon.co.uk",
		},
	],
	Australia: [
		{
			link: "https://www.amazon.com.au/dp/1984855658",
			label: "Amazon.com.au",
		},
	],
	Worldwide: [
		{
			link: "https://www.amazon.com/dp/1984855658",
			label: "Amazon.com",
		},
	],
};

const Bilp = ({ reviews, ratingsAverage, ratingsMeta }) => {
	return (
		<div>
			<Debug>{{ reviews, ratingsAverage, ratingsMeta }}</Debug>
			<div className="grid gap-y-12 items-center justify-center px-12 pb-24">
				<div className="py-36 -mx-12 bg-gradient-to-b from-bg to-bgFooter border-b border-border">
					<div className="grid grid-cols-[25fr_50fr_25fr] gap-x-8 items-center bg-[#323846] border-y border-[#a1bad8]">
						<div className="pl-12">
							<blockquote>
								“This is such a cool book. The range of Jono’s knowledge is
								astounding, and so is his ability to digest complex ideas into
								deceptively simple drawings. You’ll learn something on every
								page—and be entertained too.”
							</blockquote>
							<p className="mt-3 text-sm">
								Bill Gates, co-founder of <cite>Microsoft</cite>
							</p>
						</div>
						<div className="relative w-full aspect-square -my-24 shadow-[0_10px_20px_20px_rgba(0,0,0,0.1)]">
							<Image
								src={bookImg}
								alt="Big Ideas Little Pictures"
								layout="fill"
								objectFit="contain"
							/>
						</div>
						<div className="pr-12">
							<blockquote>
								“Big Ideas, Little Pictures is a magical collection of ideas,
								concepts, and wisdom—some that I’ve wondered about and others
								that I’ve never thought about before—presented in a clear visual
								way that makes Jono’s sketchplanations a joy to read, reference,
								and share. It’s a fantastic book!”
							</blockquote>
							<div className="mt-3 text-sm">
								Mike Rohde, bestselling author of{" "}
								<cite>The Sketchnote Handbook</cite> and illustrator of{" "}
								<cite>REWORK</cite>
							</div>
						</div>
					</div>
				</div>

				<p className="text-textSubdued text-center prose-2xl mx-auto text-balance">
					At last Sketchplanations in a book! In Big Ideas Little Pictures, Jono
					Hey collects together over 130 inspiring, funny and relatable sketches
					about life. Combining existing and new topics, Big Ideas Little
					Pictures is a perfect gift of the wisdom and joy of Sketchplanations.
				</p>

				<div className="flex flex-col items-center justify-center pt-12 border-t border-border">
					<TextHeader>Get your copy…</TextHeader>
					<Tabs className="mb-12">
						<TabList className="flex flex-row flex-wrap gap-x-4 items-center justify-center mb-6">
							{Object.entries(buyLinksByCountry).map(([country]) => (
								<Tab
									key={country}
									id={country}
									className={({ isSelected }) =>
										[
											isSelected ? "text-blue" : "bg-transparent",
											"outline-none cursor-pointer hover:text-blue",
										].join(" ")
									}
								>
									{({ isSelected }) => (
										<RoughNotation
											show={isSelected}
											iterations={1}
											animate={false}
											strokeWidth={1}
											multiline
											padding={3}
										>
											{country}
										</RoughNotation>
									)}
								</Tab>
							))}
						</TabList>

						{Object.entries(buyLinksByCountry).map(([country, links]) => (
							<TabPanel key={country} id={country}>
								<div className="flex flex-row flex-wrap items-center justify-center gap-3">
									{links.map(({ link, label }) => (
										<Link key={link} className="btn-primary" href={link}>
											{label}
										</Link>
									))}
									<Link className="btn-primary" href="#">
										Amazon.com
									</Link>
									<Link className="btn-primary" href="#">
										Barnes & Noble
									</Link>
									<Link className="btn-primary" href="#">
										Target
									</Link>
									<Link className="btn-primary" href="#">
										Bookshop
									</Link>
									<Link className="btn-primary" href="#">
										Books A Million
									</Link>
								</div>
							</TabPanel>
						))}
					</Tabs>

					<div className="grid grid-cols-1 gap-x-8 gap-y-3 items-center max-w-xl">
						<div className="max-w-md">
							<div className="prose mx-auto text-textSubdued">
								<p>
									I earn from qualifying purchases if you use the Amazon links
									on this site through the Amazon Associates program.
								</p>
							</div>
						</div>
						<div className="max-w-md">
							<div className="prose mx-auto text-textSubdued">
								<p>
									Did I miss where you are?{" "}
									<FancyLink href="#">Let me know</FancyLink>, and I’ll update
									it.
								</p>
							</div>
						</div>
						<div className="max-w-md">
							<div className="prose mx-auto text-textSubdued">
								<p>
									You should buy the book because I think you’ll love it (and
									kids will too) and you’ll also have the book.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-center justify-center pt-12 border-t border-border">
					<TextHeader>What’s inside Big Ideas Little Pictures?</TextHeader>
					<div className="w-full grid grid-cols-2 gap-8">
						<iframe
							className="w-full aspect-video shadow-lg"
							src="https://www.youtube.com/embed/dQqP6aBLHYc"
							title="Big Ideas Little Pictures —  Flick through promo"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerPolicy="strict-origin-when-cross-origin"
							allowFullScreen
						/>
						<iframe
							className="w-full aspect-video shadow-lg"
							src="https://www.youtube.com/embed/1NQqM5ZjR2g"
							title="Big Ideas Little Pictures Sneak preview"
							frameBorder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerPolicy="strict-origin-when-cross-origin"
							allowFullScreen
						/>
					</div>
				</div>

				<div className="flex flex-col items-center justify-center pt-12 border-t border-border">
					<TextHeader>
						Goodreads reviews for Big Ideas Little Pictures
					</TextHeader>

					<div className="flex flex-row gap-x-2 text-[#ff771d] mb-6">
						{[...Array(5)].map((_, i) => (
							<StarIcon
								key={i}
								filled={i < Math.round(Number.parseFloat(ratingsAverage))}
								size={32}
							/>
						))}
					</div>

					<p>{ratingsMeta}</p>

					<div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 items-center">
						{reviews.map((review) => (
							<div key={review.author} className="max-w-md">
								<RoughNotation
									animate={false}
									type="highlight"
									show={true}
									color="var(--color-paper)"
								>
									<div className="prose mx-auto text-[#222] p-12">
										<div className="flex flex-row gap-x-1 text-[#ff771d] mb-6">
											{[...Array(5)].map((_, i) => (
												<StarIcon
													key={i}
													filled={
														i < Math.round(Number.parseFloat(review.rating))
													}
												/>
											))}
										</div>

										<Shiitake lines={3} throttleRate={200}>
											{review.text}
										</Shiitake>
										<p>
											<span className="font-semibold">{review.author}</span>,{" "}
											{review.date}
										</p>
									</div>
								</RoughNotation>
							</div>
						))}
						<FancyLink
							href="https://www.goodreads.com/book/show/127280527-big-ideas-little-pictures"
							target="_blank"
							rel="noopener noreferrer"
							className="text-lg max-w-[14rem] text-center mx-auto"
						>
							{/* <span className="inline-flex flex-row gap-x-1 items-center"> */}
							View all {ratingsMeta} on Goodreads
							{/* <ChevronRight size={16} /> */}
							{/* </span> */}
						</FancyLink>
					</div>
				</div>
			</div>
		</div>
	);
};

export async function getServerSideProps() {
	try {
		const response = await fetch(
			"https://www.goodreads.com/book/show/127280527-big-ideas-little-pictures",
			{ headers: { "User-Agent": "Mozilla/5.0" } },
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const html = await response.text();

		const root = parse(html);

		console.log(html);

		const ratingsAverage = root
			.querySelector(".RatingStatistics__rating")
			.text.trim();

		const ratingsMeta = root
			.querySelector(".RatingStatistics__meta")
			.getAttribute("aria-label");

		const reviews = root
			.querySelectorAll(".ReviewCard")
			.map((element) => ({
				text: element.querySelector(".ReviewText__content")?.text.trim(),
				author: element.querySelector(".ReviewerProfile__name")?.text.trim(),
				rating: element
					.querySelector(".RatingStars")
					?.getAttribute("aria-label")
					.replace("Rating ", "")
					.replace(" out of 5", ""),
				date: element
					.querySelector(".ReviewCard__row .Text__body3")
					?.text.trim(),
			}))
			.slice(0, 5);

		return {
			props: {
				ratingsAverage,
				ratingsMeta,
				reviews,
			},
		};
	} catch (error) {
		console.error("Error fetching Goodreads reviews:", error);
		return {
			props: {
				ratingsAverage: null,
				ratingsMeta: null,
				reviews: [],
				error: error.message,
			},
		};
	}
}

export default Bilp;
