import { PrismicNextImage } from "@prismicio/next";
import classNames from "classnames";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, LoaderCircle, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import useTouchSwipe from "hooks/useTouchSwipe";

const MotionModal = motion.create(Modal);

const SketchplanationLightboxDesktop = ({
	isOpen,
	isOpening,
	isClosing,
	isLoading,
	setIsLoading,
	initialImageRect,
	imageWithAlt,
	imgixParams,
	quality,
	title,
	onPrevious = null,
	onNext = null,
	contextLabel = null,
	children,
	onClose,
	onOpenComplete,
	onCloseComplete,
}) => {
	const shouldReduceMotion = useReducedMotion();
	const zoomAnimationTime = shouldReduceMotion ? 0 : 200;

	const transformRef = useRef(null);
	const wasPanningRef = useRef(false);
	const tapTimerRef = useRef(null);
	const dialog = useRef(null);
	const [isZoomed, setIsZoomed] = useState(false);
	const [loadedUrl, setLoadedUrl] = useState(null);

	const isActive = isOpen || isOpening || isClosing;
	const isSwitchingImage =
		isOpen &&
		!isLoading &&
		loadedUrl !== null &&
		loadedUrl !== imageWithAlt.url;

	const swipeHandlers = useTouchSwipe({
		onSwipeLeft: onNext,
		onSwipeRight: onPrevious,
		disabled: !isOpen || isZoomed || (!onNext && !onPrevious),
	});

	useEffect(() => {
		transformRef.current?.resetTransform(0);
		setIsZoomed(false);
	}, [imageWithAlt.url]);

	const handleClose = useCallback(() => {
		if (isOpening || !isOpen) return;
		transformRef.current?.resetTransform(0);
		setIsZoomed(false);
		onClose();
	}, [isOpen, isOpening, onClose]);

	const handleImageTap = useCallback(() => {
		if (wasPanningRef.current) return;
		if (tapTimerRef.current) {
			clearTimeout(tapTimerRef.current);
			tapTimerRef.current = null;
			return;
		}
		tapTimerRef.current = setTimeout(() => {
			tapTimerRef.current = null;
			const scale = transformRef.current?.state?.scale ?? 1;
			if (scale <= 1) {
				handleClose();
			} else {
				transformRef.current?.resetTransform(zoomAnimationTime);
			}
		}, 250);
	}, [handleClose, zoomAnimationTime]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (isOpen && !isLoading && (e.key === "Enter" || e.key === " ")) {
				e.preventDefault();
				handleClose();
			}
		};

		if (isOpen && !isLoading) {
			document.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, isLoading, handleClose]);

	const thumbOpacity = isOpen
		? isLoading
			? 1
			: 0
		: isOpening || isClosing
			? 0
			: 1;

	if (!isActive) {
		return null;
	}

	return (
		<ModalOverlay isOpen={isActive} isDismissable onOpenChange={handleClose}>
			<motion.div
				className="fixed inset-0 z-10 bg-overlay"
				initial={{
					opacity: 0,
					backdropFilter: "blur(0px)",
					WebkitBackdropFilter: "blur(0px)",
				}}
				animate={{
					opacity: isOpen && !isLoading ? 1 : 0,
					backdropFilter: isOpen && !isLoading ? "blur(8px)" : "blur(0px)",
					WebkitBackdropFilter:
						isOpen && !isLoading ? "blur(8px)" : "blur(0px)",
				}}
				transition={{
					duration: 0.2,
				}}
			/>
			<MotionModal
				className="fixed z-20"
				style={{ opacity: thumbOpacity === 1 ? 0 : 1 }}
				initial={{
					top: initialImageRect.top,
					left: initialImageRect.left,
					width: initialImageRect.width,
					height: initialImageRect.height,
				}}
				onAnimationComplete={() => {
					if (isOpen) {
						onOpenComplete();
					} else {
						onCloseComplete();
					}
				}}
				animate={
					isOpen && !isLoading
						? {
								top: "1.5rem",
								left: "0",
								width: "100vw",
								height: "calc(var(--visual-viewport-height) - 6rem)",
							}
						: {
								top: initialImageRect.top,
								left: initialImageRect.left,
								width: initialImageRect.width,
								height: initialImageRect.height,
							}
				}
				transition={{
					type: "spring",
					damping: 10,
					stiffness: 200,
					mass: 0.1,
				}}
			>
				<Dialog
					ref={dialog}
					className="w-full h-full"
					aria-label={`${title} - zoomable image`}
					{...swipeHandlers}
				>
					<TransformWrapper
						ref={transformRef}
						minScale={1}
						maxScale={3}
						initialScale={1}
						centerOnInit
						limitToBounds
						panning={{ disabled: !isZoomed }}
						doubleClick={{
							mode: "toggle",
							step: 2,
							animationTime: zoomAnimationTime,
						}}
						wheel={{ step: 0.08, smoothStep: 0.003 }}
						onTransform={(_ref, state) => {
							setIsZoomed(state.scale > 1.001);
						}}
						onPanningStart={() => {
							wasPanningRef.current = false;
						}}
						onPanning={() => {
							wasPanningRef.current = true;
						}}
						onPanningStop={() => {
							window.setTimeout(() => {
								wasPanningRef.current = false;
							}, 50);
						}}
					>
						<TransformComponent
							wrapperStyle={{ width: "100%", height: "100%" }}
							contentStyle={{
								width: "100%",
								height: "100%",
								touchAction: "none",
							}}
						>
							<div
								role="presentation"
								className={`relative w-full h-full ${isZoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-out"}`}
								onClick={handleImageTap}
							>
								{isSwitchingImage && (
									<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
										<LoaderCircle
											className="animate-spin text-white/60"
											strokeWidth={1.5}
											size={36}
										/>
									</div>
								)}
								<PrismicNextImage
									key={imageWithAlt.url}
									field={imageWithAlt}
									className={classNames(
										"object-contain pointer-events-none transition-opacity duration-150",
										isSwitchingImage ? "opacity-0" : "opacity-100",
									)}
									sizes="calc(100w - 3rem)"
									fill={true}
									priority
									onLoad={() => {
										setIsLoading(false);
										setLoadedUrl(imageWithAlt.url);
									}}
									imgixParams={imgixParams}
									quality={quality}
								/>
							</div>
						</TransformComponent>
					</TransformWrapper>
				</Dialog>
				{isOpen && !isLoading && (
					<button
						type="button"
						data-swipe-ignore
						onClick={handleClose}
						aria-label="Close"
						className="fixed z-30 top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
					>
						<X size={20} strokeWidth={2} />
					</button>
				)}
				{isOpen && !isLoading && !isZoomed && onPrevious && (
					<button
						type="button"
						data-swipe-ignore
						onClick={onPrevious}
						aria-label={
							contextLabel ? `Previous in ${contextLabel}` : "Previous sketch"
						}
						className="fixed z-30 top-1/2 -translate-y-1/2 left-4 flex items-center justify-center w-11 h-11 rounded-full bg-black/45 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
					>
						<ChevronLeft size={24} strokeWidth={2} />
					</button>
				)}
				{isOpen && !isLoading && !isZoomed && onNext && (
					<button
						type="button"
						data-swipe-ignore
						onClick={onNext}
						aria-label={
							contextLabel ? `Next in ${contextLabel}` : "Next sketch"
						}
						className="fixed z-30 top-1/2 -translate-y-1/2 right-4 flex items-center justify-center w-11 h-11 rounded-full bg-black/45 text-white backdrop-blur-sm hover:bg-black/70 transition-colors"
					>
						<ChevronRight size={24} strokeWidth={2} />
					</button>
				)}
				<AnimatePresence>
					{isOpen && !isLoading && !isZoomed && children && (
						<motion.div
							className="fixed z-20 bottom-0 left-0 right-0 flex items-center justify-center h-14 border-t border-[rgba(255,255,255,0.05)] backdrop-blur-sm"
							initial={{
								translateY: 100,
							}}
							animate={{
								translateY: 0,
							}}
							exit={{
								translateY: 100,
							}}
							transition={{
								duration: 0.2,
							}}
						>
							{children}
						</motion.div>
					)}
				</AnimatePresence>
			</MotionModal>
		</ModalOverlay>
	);
};

export default SketchplanationLightboxDesktop;
