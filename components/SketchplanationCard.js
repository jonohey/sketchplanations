import { PrismicNextImage } from "@prismicio/next";
import classNames from "classnames";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { getPrismicImageOptimisation } from "helpers/prismicImageOptimisation";
import styles from "./SketchplanationCard.module.css";

const CARD_THUMB_IMGIX_PARAMS = {
	fit: "crop",
	crop: "top",
	ar: "5:3",
};

const SketchplanationCard = ({
	sketchplanation,
	imageProps = {},
	isLoading = false,
}) => {
	const rootClassName = classNames(styles.root, "group");
	const { imgixParams, quality } = getPrismicImageOptimisation(
		sketchplanation.data.image,
		CARD_THUMB_IMGIX_PARAMS,
	);

	const content = (
		<>
			<span className={styles.imageContainer}>
				{isLoading ? (
					<div className={styles.loaderContainer}>
						<LoaderCircle
							className={styles.loader}
							strokeWidth={1}
							color="var(--color-paperDarker)"
							size={40}
						/>
					</div>
				) : (
					// <Image
					// 	{...imageProps}
					// 	src={sketchplanation.data.image.url}
					// 	title={sketchplanation.data.title}
					// 	className={styles.image}
					// 	fill={true}
					// 	alt={sketchplanation.data.title}
					// />
					<PrismicNextImage
						field={sketchplanation.data.image}
						className={styles.image}
						fill={true}
						imgixParams={imgixParams}
						quality={quality}
						fallbackAlt=""
						{...imageProps}
					/>
				)}
			</span>
			<span className={styles.title}>
				{isLoading ? "…" : sketchplanation.data.title}
			</span>
		</>
	);

	return isLoading ? (
		<div className={rootClassName}>{content}</div>
	) : (
		<Link href={`/${sketchplanation.uid}`} className={rootClassName}>
			{content}
		</Link>
	);
};

export default SketchplanationCard;
