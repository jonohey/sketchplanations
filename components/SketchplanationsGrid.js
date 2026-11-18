import styles from "./SketchplanationsGrid.module.css";

import NavContextScope from "./NavContextScope";
import SketchplanationCard from "./SketchplanationCard";

const SketchplanationsGrid = ({
	prismicDocs: sketchplanations = [],
	shortcutKeys = [],
	navContext = null,
}) => {
	return (
		<NavContextScope context={navContext} className={styles.root}>
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
		</NavContextScope>
	);
};

export default SketchplanationsGrid;
