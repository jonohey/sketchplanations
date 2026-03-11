import { useCallback, useRef, useState } from "react";

const useDraggable = (containerRef, positions, setPositions) => {
	const dragState = useRef(null);
	const [draggingIndex, setDraggingIndex] = useState(null);

	const handlePointerMove = useCallback(
		(e) => {
			if (!dragState.current || !containerRef.current) return;

			const { index, offsetX, offsetY, size } = dragState.current;
			const rect = containerRef.current.getBoundingClientRect();

			const x = Math.max(
				0,
				Math.min(e.clientX - rect.left - offsetX, rect.width - size),
			);
			const y = Math.max(
				0,
				Math.min(e.clientY - rect.top - offsetY, rect.height - size),
			);

			setPositions((prev) => {
				const next = [...prev];
				next[index] = { ...next[index], x, y };
				return next;
			});
		},
		[containerRef, setPositions],
	);

	const handlePointerUp = useCallback(() => {
		dragState.current = null;
		setDraggingIndex(null);
		window.removeEventListener("pointermove", handlePointerMove);
		window.removeEventListener("pointerup", handlePointerUp);
	}, [handlePointerMove]);

	const getItemProps = useCallback(
		(index) => ({
			onPointerDown: (e) => {
				e.preventDefault();
				const pos = positions[index];
				if (!pos) return;

				const rect = containerRef.current.getBoundingClientRect();
				dragState.current = {
					index,
					offsetX: e.clientX - rect.left - pos.x,
					offsetY: e.clientY - rect.top - pos.y,
					size: pos.size,
				};
				setDraggingIndex(index);

				window.addEventListener("pointermove", handlePointerMove);
				window.addEventListener("pointerup", handlePointerUp);
			},
			style: {
				cursor: draggingIndex === index ? "grabbing" : "grab",
			},
		}),
		[positions, containerRef, handlePointerMove, handlePointerUp, draggingIndex],
	);

	return { getItemProps, draggingIndex };
};

export default useDraggable;
