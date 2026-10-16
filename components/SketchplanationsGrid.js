import styles from "./SketchplanationsGrid.module.css";

import SketchplanationCard from "./SketchplanationCard";

const SketchplanationsGrid = ({ prismicDocs: sketchplanations = [] }) => {
	return (
		<div className={styles.root}>
			{sketchplanations?.map((sketchplanation) => (
				<SketchplanationCard
					key={sketchplanation.uid}
					sketchplanation={sketchplanation}
					imageProps={{
						sizes: "(min-width: 14rem) 14rem, 100vw",
					}}
				/>
			))}
		</div>
	);
};

export default SketchplanationsGrid;
