import { track } from '@vercel/analytics';
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FancyLink from "./FancyLink";

import bigIdeasLittlePicturesImage from "images/bigideaslittlepictures.jpg";
import podcastImage from "images/podcast.jpg";

import styles from "./Cards.module.css";

const Card = ({ href, imageSrc, alt, content, onImageClick, target, rel }) => (
	<div className={styles.card}>
		{imageSrc && (
			<Link href={href} onClick={onImageClick} target={target} rel={rel}>
				<Image src={imageSrc} alt={alt} sizes="6rem" className="w-full" />
			</Link>
		)}
		<p>{content}</p>
	</div>
);

export const Cards = () => (
	<div className={styles.cards}>
		<Card
			href="/big-ideas-little-pictures"
			imageSrc={bigIdeasLittlePicturesImage}
			alt="Big Ideas Little Pictures"
			onImageClick={() => {
				track('Book-page-link', { location: 'card-image' });
			}}
			content={
				<>
					Sketchplanations in a book! I think you&apos;ll love{" "}
					<FancyLink
						href="/big-ideas-little-pictures"
						onClick={() => {
							track('Book-page-link', { location: 'card' });
						}}
					>
						Big Ideas Little Pictures
					</FancyLink>
				</>
			}
		/>
		<Card
			href="https://podcast.sketchplanations.com/"
			imageSrc={podcastImage}
			alt="Sketchplanations podcast photo of Rob Bell, Tom Pellereau and Jono Hey"
			onImageClick={() => {
				track('Podcast-site-link', { location: 'card-image' });
			}}
			target="_blank"
			rel="noopener"
			content={
				<>
					Prefer to listen?
					<FancyLink
						href="https://podcast.sketchplanations.com/"
						target="_blank"
						rel="noopener"
						onClick={() => {
							track('Podcast-site-link', { location: 'card' });
						}}
					>
						<span>
							<br/>
							<span>Try the podcast</span>{" "}
							<ExternalLink
								size={16}
								className="inline relate -translate-y-[2px]"
							/>
						</span>
					</FancyLink>
				</>
			}
		/>
		<Card
			href="https://www.patreon.com/sketchplanations"
			onImageClick={() => {
				track('Patreon-site-link', { location: 'card-image' });
			}}
			content={
				<>
					Like Sketchplanations?{" "}
					<FancyLink href="https://www.patreon.com/sketchplanations"
						target="_blank"
						rel="noopener noreferrer"
						onClick={() => {
							track('Patreon-site-link', { location: 'card' });
						}}
					>
						<span>
							<br/>
							<span>Support me on Patreon</span>{" "}
							<ExternalLink
								size={16}
								className="inline relate -translate-y-[2px]"
							/>
						</span>
					</FancyLink>{" "}
				</>
			}
		/>
	</div>
);

export default Cards;
