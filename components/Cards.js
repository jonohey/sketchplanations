import { track } from '@vercel/analytics';
import Image from "next/image";
import Link from "next/link";
import FancyLink from "./FancyLink";

import bigIdeasLittlePicturesImage from "images/bigideaslittlepictures.jpg";
import podcastImage from "images/podcast.jpg";

import styles from "./Cards.module.css";

const SUBSTACK_SUBSCRIBE_URL = "https://sketchplanations.substack.com/subscribe";

const Card = ({ href, imageSrc, alt, content, onImageClick, target, rel }) => (
	<div className={styles.card}>
		{imageSrc && (
			<Link href={href} onClick={onImageClick} target={target} rel={rel}>
				<Image src={imageSrc} alt={alt} sizes="6rem" className="w-full" />
			</Link>
		)}
		<div className="prose">{content}</div>
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
					<div>Get the book!</div>
					<div>
						<FancyLink
							href="/big-ideas-little-pictures"
							onClick={() => {
								track('Book-page-link', { location: 'card' });
							}}
						>
							Big Ideas Little Pictures
						</FancyLink>
					</div>
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
					<div>Prefer to listen?</div>
					<div>
						<FancyLink
							href="https://podcast.sketchplanations.com/"
							target="_blank"
							rel="noopener"
							onClick={() => {
								track('Podcast-site-link', { location: 'card' });
							}}
						>
							Try the podcast
						</FancyLink>
					</div>
				</>
			}
		/>
		<Card
			href={SUBSTACK_SUBSCRIBE_URL}
			target="_blank"
			rel="noopener noreferrer"
			onImageClick={() => {
				track('Subscribe', { location: 'card-image' });
			}}
			content={
				<div className={styles.supportCard}>
					<div>
						<span className="inline sm:hidden">🎉 Help keep Sketchplanations ad-free </span>
						<span className="hidden sm:inline xl:hidden">🎉 Keep this ad-free </span>
						<span className="hidden xl:inline">🎉 Help keep Sketchplanations ad-free </span>
						<FancyLink
							href={SUBSTACK_SUBSCRIBE_URL}
							target="_blank"
							rel="noopener noreferrer"
						>
							by supporting me
						</FancyLink>
					</div>
				</div>
			}
		/>
	</div>
);

export default Cards;
