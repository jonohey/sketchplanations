import { easingCoordinates } from "easing-coordinates";

const GradientBlur = ({
	height = 4,
	steps = 10,
	from = 2,
	to = 0.5,
	easing = "linear",
}) => {
	const divs = [];

	const coordinates =
		easing === "linear" ? null : easingCoordinates(easing, steps);

	for (let i = 0; i < steps; i++) {
		const progress = i / (steps - 1);
		const childHeight = height * ((i + 1) / steps);

		const easedProgress = coordinates ? coordinates[i].y : progress;

		const blur = from + (to - from) * easedProgress;

		divs.push(
			<div
				key={i}
				style={{
					position: "absolute",
					top: 0,
					height: `${childHeight}rem`,
					width: "100%",
					backdropFilter: `blur(${blur}px)`,
					maskImage: `linear-gradient(0deg, transparent 0%, rgb(0, 0, 0) ${height / 5}rem)`,
				}}
			/>,
		);
	}

	return (
		<div
			style={{
				position: "relative",
				height: `${height}rem`,
				pointerEvents: "none",
			}}
		>
			{divs}
		</div>
	);
};

export default GradientBlur;
