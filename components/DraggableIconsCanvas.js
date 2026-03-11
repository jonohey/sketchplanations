import useDraggable from "hooks/useDraggable";
import { useCallback, useEffect, useRef, useState } from "react";

const MIN_SIZE = 64;
const MAX_SIZE = 80;
const PADDING = 16;
const MAX_PLACEMENT_ATTEMPTS = 100;

const overlaps = (a, placed) => {
	for (const b of placed) {
		const gap = 8;
		if (
			a.x < b.x + b.size + gap &&
			a.x + a.size + gap > b.x &&
			a.y < b.y + b.size + gap &&
			a.y + a.size + gap > b.y
		) {
			return true;
		}
	}
	return false;
};

const generateRandomPositions = (count, containerWidth, containerHeight) => {
	const placed = [];
	for (let i = 0; i < count; i++) {
		const size = MIN_SIZE + Math.random() * (MAX_SIZE - MIN_SIZE);
		let candidate = null;

		for (let attempt = 0; attempt < MAX_PLACEMENT_ATTEMPTS; attempt++) {
			const pos = {
				x: PADDING + Math.random() * (containerWidth - size - PADDING * 2),
				y: PADDING + Math.random() * (containerHeight - size - PADDING * 2),
				size,
			};
			if (!overlaps(pos, placed)) {
				candidate = pos;
				break;
			}
		}

		if (!candidate) break;
		placed.push(candidate);
	}
	return placed;
};

const DraggableIconsCanvas = ({ icons }) => {
	const containerRef = useRef(null);
	const iconsRef = useRef(icons);
	const [positions, setPositions] = useState([]);
	const [ready, setReady] = useState(false);
	const { getItemProps, draggingIndex } = useDraggable(
		containerRef,
		positions,
		setPositions,
	);

	const initPositions = useCallback(() => {
		if (!containerRef.current || icons.length === 0) return;
		const { width, height } = containerRef.current.getBoundingClientRect();
		if (width === 0 || height === 0) return;
		const shuffled = [...icons].sort(() => Math.random() - 0.5);
		const placed = generateRandomPositions(shuffled.length, width, height);
		iconsRef.current = shuffled.slice(0, placed.length);
		setPositions(placed);
		setReady(true);
	}, [icons]);

	useEffect(() => {
		initPositions();
	}, [initPositions]);

	useEffect(() => {
		const handleResize = () => initPositions();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [initPositions]);

	return (
		<div className="lp-card-primary rounded-2xl p-8 mt-8">
			<h3 className="text-xl font-semibold mb-4 text-center">
				And tons more…
			</h3>
			<div
				ref={containerRef}
				className="relative w-full rounded-xl overflow-hidden"
				style={{
					height: 500,
					background: "white",
					touchAction: "none",
					userSelect: "none",
				}}
			>
				{ready &&
					positions.map((pos, i) => {
						const itemProps = getItemProps(i);
						return (
							<img
								key={i}
								src={iconsRef.current[i]}
								alt=""
								draggable={false}
								{...itemProps}
								style={{
									position: "absolute",
									left: pos.x,
									top: pos.y,
									width: pos.size,
									height: pos.size,
									objectFit: "contain",
									zIndex: draggingIndex === i ? 10 : 1,
									...itemProps.style,
								}}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default DraggableIconsCanvas;
