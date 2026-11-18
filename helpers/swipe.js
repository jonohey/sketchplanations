export function detectSwipe({ deltaX, deltaY, threshold = 50 }) {
	if (Math.abs(deltaX) <= Math.abs(deltaY)) return null;
	if (Math.abs(deltaX) < threshold) return null;
	return deltaX < 0 ? "left" : "right";
}
