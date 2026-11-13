import styles from "./SketchplanationsGrid.module.css";

import SketchplanationCard from "./SketchplanationCard";

const SketchplanationsGrid = ({
	prismicDocs: sketchplanations = [],
	shortcutKeys = [],
}) => {
	return (
		<div className={styles.root}>
			{sketchplanations?.map((sketchplanation, index) => (
				<SketchplanationCard
					key={sketchplanation.uid}
					sketchplanation={sketchplanation}
					shortcutKey={shortcutKeys[index]}
					imageProps={{
						sizes: "(min-width: 14rem) 14rem, 100vw",
					}}
				/>
			))}
		</div>
	);
};

export default SketchplanationsGrid;
