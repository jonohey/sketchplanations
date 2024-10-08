import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useHotkeys } from "react-hotkeys-hook";

import styles from "./PrevNextSketchplanation.module.css";

const PrevNextSketchplanation = ({ sketchplanation, kind }) => {
	const keyboardKey = kind === "next" ? "j" : "k";
	const secondaryKeyboardKey = kind === "next" ? "left" : "right";
	const router = useRouter();

	const navigate = () =>
		sketchplanation?.uid && router.push(`/${sketchplanation.uid}`);

	useHotkeys(keyboardKey, navigate, {}, [sketchplanation]);
	useHotkeys(secondaryKeyboardKey, navigate, {}, [sketchplanation]);

	if (!sketchplanation) return <div />;

	const {
		data: { image, title },
		uid,
	} = sketchplanation;

	return (
		<Link
			href={`/${uid}`}
			className={classNames(styles.image, styles[`image-${kind}`])}
		>
			<div
				className={classNames(
					styles["caret-wrapper"],
					styles[`caret-wrapper-${kind}`],
				)}
			>
				<svg
					className={styles.caret}
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
					fillRule="evenodd"
					clipRule="evenodd"
				>
					<path d="M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z" />
				</svg>
			</div>
			<div className={styles.imageEl}>
				<Image
					src={image.url}
					width={image.dimensions.width}
					height={image.dimensions.height}
					sizes="(max-width: 600px) calc(50vw - 80%) , (min-width: 600px) calc(50vw - 62%) , 140px"
					alt={image.alt || `${title} - Sketchplanations`}
				/>
			</div>
			<div className={classNames(styles.info, styles[`info-${kind}`])}>
				<span className={styles.title}>{title}</span>
				<div className={styles["keyboard-shortcuts"]}>
					<kbd className={styles["keyboard-key"]}>{keyboardKey}</kbd>
				</div>
			</div>
		</Link>
	);
};

export default PrevNextSketchplanation;
