import Image from "next/image";
import Link from "next/link";
import FancyLink from "./FancyLink";
import { ExternalLink } from "lucide-react";
import bigIdeasLittlePicturesImage from "images/bigideaslittlepictures.jpg";
import podcastImage from "images/podcast.jpg";

import styles from "./Cards.module.css";

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

export const Cards = () => (
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
						<span className="inline">
							<span>Listen to the podcast</span>{" "}
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
			href="/thanks"
			content={
				<>
					Like Sketchplanations?. I keep it going thanks to{" "}
					<FancyLink href="https://www.patreon.com/sketchplanations">
						<span className="inline">
							<span>my patrons</span>{" "}
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
