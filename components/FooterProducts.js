import { track } from "@vercel/analytics";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import styles from "./FooterProducts.module.css";

import {
	EXPLAINER_KIT_PATH,
	trackExplainerKitClick,
} from "helpers/explainerKit";
import bookCoverImage from "images/big-ideas-little-pictures-book-cover.jpg";
import explainerKitSlideImage from "images/explainer-kit/explainer-kit-copy-paste.png";
import podcastImage from "images/podcast.jpg";

import Book3D from "./Book3D";

const PODCAST_URL = "https://podcast.sketchplanations.com/";

const PRODUCTS = [
	{
		key: "book",
		href: "/big-ideas-little-pictures",
		image: bookCoverImage,
		book3D: true,
		alt: "Big Ideas Little Pictures book cover",
		title: "Big Ideas Little Pictures",
		text: "“Purchase four for gifts and a fifth for self.” — Amazon review",
		cta: "See inside the book",
		onClick: () => track("Book-page-link", { location: "footer-tile" }),
	},
	{
		key: "kit",
		href: EXPLAINER_KIT_PATH,
		image: explainerKitSlideImage,
		alt: "A hand-drawn Explainer Kit visual pasted into a slide",
		title: "Explainer Kit",
		text: "250+ hand-drawn visuals for your slides, lessons and workshops.",
		cta: "Explore the Explainer Kit",
		onClick: () => trackExplainerKitClick("footer_tile"),
	},
	{
		key: "podcast",
		href: PODCAST_URL,
		external: true,
		image: podcastImage,
		alt: "Rob Bell, Tom Pellereau and Jono Hey on the podcast cover",
		title: "The podcast",
		text: "Rob, Tom and I talk through the ideas behind the sketches.",
		cta: "Listen to the podcast",
		onClick: () => track("Podcast-site-link", { location: "footer-tile" }),
	},
];

const FooterProducts = () => (
	<section aria-labelledby="footer-products-heading">
		<h2 id="footer-products-heading" className={styles.heading}>
			More from Sketchplanations
		</h2>
		<ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-3">
			{PRODUCTS.map(
				({
					key,
					href,
					external,
					image,
					book3D,
					alt,
					title,
					text,
					cta,
					onClick,
				}) => (
					<li key={key}>
						<Link
							href={href}
							className={`${styles.tile} ${book3D ? "book3d-turn" : ""}`}
							onClick={onClick}
							{...(external
								? { target: "_blank", rel: "noopener noreferrer" }
								: {})}
						>
							<span className={styles.imageWrap}>
								{book3D ? (
									<Book3D
										cover={image}
										alt={alt}
										small
										className={styles.book}
									/>
								) : (
									<Image
										src={image}
										alt={alt}
										sizes="(min-width: 640px) 16rem, 8rem"
										className={styles.image}
									/>
								)}
							</span>
							<span className={styles.title}>{title}</span>
							<span className={styles.text}>{text}</span>
							<span className={styles.cta}>
								{cta}
								<ArrowRight size={16} aria-hidden="true" />
							</span>
						</Link>
					</li>
				),
			)}
		</ul>
	</section>
);

export default FooterProducts;
