import { track } from "@vercel/analytics";
import { PrismicNextImage } from "@prismicio/next";
import Link from "next/link";

import { humanizePublishedDate } from "helpers";
import styles from "./HomeFeaturedSketch.module.css";

const FEATURED_IMAGE_SIZES =
	"(max-width: 640px) calc(100vw - 2rem), 28rem";

export default function HomeFeaturedSketch({ sketch }) {
	const sketchHref = `/${sketch.uid}`;
	const imageField = sketch.image?.alt
		? sketch.image
		: { ...sketch.image, alt: sketch.title };

	return (
		<article>
			<Link
				href={sketchHref}
				className={styles.root}
				onClick={() =>
					track("homepage_featured_sketch_click", {
						sketch: sketch.title,
					})
				}
			>
				<span className={styles.imageWrap}>
					<PrismicNextImage
						field={imageField}
						className={styles.image}
						fill
						sizes={FEATURED_IMAGE_SIZES}
						loading="lazy"
						imgixParams={{
							fit: "crop",
							crop: "top",
							ar: "1:1",
							w: 672,
						}}
					/>
				</span>
				<h3 className={styles.title}>{sketch.title}</h3>
				{sketch.publishedAt && (
					<time className={styles.date} dateTime={sketch.publishedAt}>
						{humanizePublishedDate(sketch.publishedAt, { relative: true })}
					</time>
				)}
			</Link>
		</article>
	);
}
