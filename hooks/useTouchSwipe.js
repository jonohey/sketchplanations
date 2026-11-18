import { useEffect, useRef } from "react";

import { detectSwipe } from "helpers/swipe";

const isIgnoredSwipeTarget = (target) =>
	target instanceof Element && target.closest("[data-swipe-ignore]") !== null;

export default function useTouchSwipe({
	onSwipeLeft,
	onSwipeRight,
	disabled = false,
	threshold = 50,
}) {
	const startRef = useRef(null);
	const multiTouchRef = useRef(false);
	const sawTouchEventRef = useRef(false);
	const activePointerIdRef = useRef(null);
	const suppressClickRef = useRef(false);
	const suppressTimerRef = useRef(null);
	const navTimerRef = useRef(null);

	useEffect(() => {
		return () => {
			if (suppressTimerRef.current) {
				window.clearTimeout(suppressTimerRef.current);
			}
			if (navTimerRef.current) {
				window.clearTimeout(navTimerRef.current);
			}
		};
	}, []);

	const armClickSuppression = () => {
		suppressClickRef.current = true;
		if (suppressTimerRef.current) {
			window.clearTimeout(suppressTimerRef.current);
		}
		suppressTimerRef.current = window.setTimeout(() => {
			suppressClickRef.current = false;
			suppressTimerRef.current = null;
		}, 400);
	};

	const commitSwipe = (endX, endY) => {
		const origin = startRef.current;
		startRef.current = null;
		if (disabled || multiTouchRef.current || !origin) return false;

		const direction = detectSwipe({
			deltaX: endX - origin.x,
			deltaY: endY - origin.y,
			threshold,
		});

		const callback =
			direction === "left"
				? onSwipeLeft
				: direction === "right"
					? onSwipeRight
					: null;

		if (!callback) return false;

		armClickSuppression();
		// Defer route changes until after touchend finishes so the browser's touch
		// gesture state machine completes cleanly before the target node unmounts.
		if (navTimerRef.current) window.clearTimeout(navTimerRef.current);
		navTimerRef.current = window.setTimeout(() => {
			navTimerRef.current = null;
			callback();
		}, 0);
		return true;
	};

	const onTouchStartCapture = (event) => {
		sawTouchEventRef.current = true;
		if (disabled || isIgnoredSwipeTarget(event.target)) return;

		if (event.touches.length > 1) {
			multiTouchRef.current = true;
			startRef.current = null;
			return;
		}

		const touch = event.touches[0];
		if (!touch) return;
		multiTouchRef.current = false;
		startRef.current = { x: touch.clientX, y: touch.clientY };
	};

	const onTouchMoveCapture = (event) => {
		if (event.touches.length > 1) {
			multiTouchRef.current = true;
			startRef.current = null;
		}
	};

	const onTouchEndCapture = (event) => {
		const touch = event.changedTouches?.[0];
		if (touch) {
			commitSwipe(touch.clientX, touch.clientY);
		}
		if (event.touches.length === 0) {
			multiTouchRef.current = false;
		}
	};

	const onTouchCancelCapture = () => {
		startRef.current = null;
		multiTouchRef.current = false;
	};

	// Pointer fallback for environments that emit touch PointerEvents without TouchEvents.
	const onPointerDownCapture = (event) => {
		if (sawTouchEventRef.current) return;
		if (disabled || event.pointerType !== "touch") return;
		if (isIgnoredSwipeTarget(event.target)) return;

		if (activePointerIdRef.current !== null) {
			multiTouchRef.current = true;
			startRef.current = null;
			return;
		}

		multiTouchRef.current = false;
		activePointerIdRef.current = event.pointerId;
		startRef.current = { x: event.clientX, y: event.clientY };
	};

	const onPointerUpCapture = (event) => {
		if (sawTouchEventRef.current) return;
		if (event.pointerType !== "touch") return;
		if (activePointerIdRef.current !== event.pointerId) return;

		activePointerIdRef.current = null;
		commitSwipe(event.clientX, event.clientY);
		multiTouchRef.current = false;
	};

	const onPointerCancelCapture = (event) => {
		if (sawTouchEventRef.current) return;
		if (event.pointerType !== "touch") return;
		if (activePointerIdRef.current === event.pointerId) {
			activePointerIdRef.current = null;
		}
		startRef.current = null;
		multiTouchRef.current = false;
	};

	const onClickCapture = (event) => {
		if (!suppressClickRef.current) return;
		suppressClickRef.current = false;
		if (suppressTimerRef.current) {
			window.clearTimeout(suppressTimerRef.current);
			suppressTimerRef.current = null;
		}
		event.preventDefault();
		event.stopPropagation();
	};

	return {
		onTouchStartCapture,
		onTouchMoveCapture,
		onTouchEndCapture,
		onTouchCancelCapture,
		onPointerDownCapture,
		onPointerUpCapture,
		onPointerCancelCapture,
		onClickCapture,
	};
}
