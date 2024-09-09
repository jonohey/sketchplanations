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
						sizes: "14rem",
					}}
				/>
			))}
		</div>
	);
};

export default SketchplanationsGrid;
