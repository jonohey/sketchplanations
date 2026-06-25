import styles from "./RudeSearchEasterEgg.module.css";

const STILL_SRC = "/images/search/rude-search-still.png";
const ANIMATED_SRC = "/images/search/rude-search.webp";

const RudeSearchEasterEgg = () => (
	<div className={styles.root} aria-hidden="true">
		<picture>
			<source srcSet={STILL_SRC} media="(prefers-reduced-motion: reduce)" />
			<img
				src={ANIMATED_SRC}
				alt=""
				width={612}
				height={635}
				className={styles.image}
			/>
		</picture>
	</div>
);

export default RudeSearchEasterEgg;
