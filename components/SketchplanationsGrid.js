import SketchplanationCard from "./SketchplanationCard";
import styles from "./SketchplanationsGrid.module.css";

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
