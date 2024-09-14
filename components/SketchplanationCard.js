import Link from "next/link";
import Image from "next/image";
import { LoaderCircle } from "lucide-react";
import styles from "./SketchplanationCard.module.css";
import classNames from "classnames";
import { PrismicNextImage } from "@prismicio/next";

const SketchplanationCard = ({
	sketchplanation,
	imageProps = {},
	isLoading = false,
}) => {
	const rootClassName = classNames(styles.root, "group");

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
						imgixParams={{ fit: "crop", crop: "top", ar: "5:3" }}
						{...imageProps}
						fallbackAlt={sketchplanation.data.title}
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
