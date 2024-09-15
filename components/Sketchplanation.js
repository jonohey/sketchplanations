import * as prismicH from "@prismicio/helpers";
import { PrismicNextImage } from "@prismicio/next";
import dynamic from "next/dynamic";
import Link from "next/link";
import Shiitake from "shiitake";

import styles from "./Sketchplanation.module.css";

import { humanizePublishedDate } from "helpers";
import FancyLink from "./FancyLink";

const TextHeader = dynamic(() => import("./TextHeader"));

const Sketchplanation = ({ sketchplanation, priority = false }) => {
	const {
		data: { image, title, body, published_at: publishedAt },
		uid,
	} = sketchplanation;

	const publishedText = humanizePublishedDate(publishedAt);

	return (
		<article className={styles.root}>
			<Link href={`/${uid}`} className={styles.image}>
				<PrismicNextImage
					field={image}
					title={title}
					priority={priority}
					sizes="(max-width: 640px) calc(100vw - 2.5rem), 38rem"
					imgixParams={{
						format: "auto",
					}}
				/>
			</Link>
			<div className={styles.content}>
				<Link href={`/${uid}`}>
					<TextHeader as="h2">{title}</TextHeader>
				</Link>
				<div className="prose">
					<Shiitake lines={3} throttleRate={200}>
						{prismicH.asText(body)}
					</Shiitake>
					<FancyLink href={`/${uid}`}>Read more…</FancyLink>
				</div>
				<time className={styles["published-at"]} dateTime={publishedAt}>
					{publishedText}
				</time>
			</div>
		</article>
	);
};

export default Sketchplanation;
