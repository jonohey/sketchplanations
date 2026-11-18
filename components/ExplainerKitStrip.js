import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import styles from "./ExplainerKitStrip.module.css";

import {
	EXPLAINER_KIT_PATH,
	EXPLAINER_KIT_PROMO,
	trackExplainerKitClick,
} from "helpers/explainerKit";

const ICON_DIR = "/images/explainer-kit/sketch-icons";

const KitImage = ({ name, width, height, className, sizes }) => (
	<Image
		src={`${ICON_DIR}/${name}@0.5x.png`}
		alt=""
		width={width}
		height={height}
		sizes={sizes}
		className={className}
	/>
);

// Two tilted "slides" showing kit visuals in use.
const SlidesVisual = () => (
	<div className={styles.slides} aria-hidden="true">
		<div className={styles.blob} />
		<div className={`${styles.slide} ${styles.slideBack}`}>
			<p className={styles.slideTitle}>Why teams get stuck</p>
			<div className={styles.slideArt}>
				<KitImage
					name="puzzling"
					width={165}
					height={289}
					sizes="90px"
					className={styles.artTall}
				/>
				<KitImage
					name="thinking-hard-person"
					width={115}
					height={194}
					sizes="90px"
					className={styles.artTall}
				/>
			</div>
		</div>
		<div className={`${styles.slide} ${styles.slideFront}`}>
			<p className={styles.slideTitle}>Where are we headed?</p>
			<div className={styles.slideArt}>
				<KitImage
					name="person-looking-at-a-map"
					width={214}
					height={268}
					sizes="120px"
					className={styles.artTall}
				/>
				<KitImage
					name="up-down-chart"
					width={163}
					height={150}
					sizes="120px"
					className={styles.artWide}
				/>
				<KitImage
					name="lightbulb-partial"
					width={133}
					height={140}
					sizes="90px"
					className={styles.artWide}
				/>
			</div>
		</div>
	</div>
);

// The homepage Explainer Kit feature (placement "homepage").
const ExplainerKitStrip = ({ id }) => {
	const { eyebrow, heading, body, features, cta } = EXPLAINER_KIT_PROMO;
	const headingId = "homepage-explainer-kit-heading";

	return (
		<section id={id} aria-labelledby={headingId} className={styles.home}>
			<SlidesVisual />
			<div className="w-full md:w-1/2">
				<p className={styles.eyebrow}>{eyebrow}</p>
				<h2 id={headingId} className={styles.homeHeading}>
					{heading}
				</h2>
				<p className={styles.body}>{body}</p>
				<ul className={styles.features}>
					{features.map((feature) => (
						<li key={feature} className={styles.feature}>
							<Check size={16} aria-hidden="true" className={styles.check} />
							{feature}
						</li>
					))}
				</ul>
				<div className="mt-6">
					<Link
						href={EXPLAINER_KIT_PATH}
						className="btn-primary inline-block px-8 text-center"
						onClick={() => trackExplainerKitClick("homepage")}
					>
						{cta}
					</Link>
				</div>
			</div>
		</section>
	);
};

export default ExplainerKitStrip;
