import * as prismicH from "@prismicio/helpers";
import classNames from "classnames";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import Shiitake from "shiitake";

import styles from "./Sketchplanation.module.css";

import { humanizePublishedDate } from "helpers";
import { PrismicNextImage } from "@prismicio/next";

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
					lightbox={false}
					sizes="(max-width: 40rem) 100vw, 40rem"
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
					<Link href={`/${uid}`}>Read more…</Link>
				</div>
				<time className={styles["published-at"]} dateTime={publishedAt}>
					{publishedText}
				</time>
			</div>
		</article>
	);
};

export default Sketchplanation;
