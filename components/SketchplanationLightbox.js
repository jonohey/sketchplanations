import { PrismicNextImage } from "@prismicio/next";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import styles from "./SketchplanationLightbox.module.css";

const SketchplanationLightboxDesktop = dynamic(
	() => import("components/SketchplanationLightboxDesktop"),
	{ ssr: false },
);

function useIsMobile() {
	const [isMobile, setIsMobile] = useState(true);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 767px)");
		const update = () => setIsMobile(mediaQuery.matches);
		update();
		mediaQuery.addEventListener("change", update);
		return () => mediaQuery.removeEventListener("change", update);
	}, []);

	return isMobile;
}

const SketchplanationLightboxMobile = ({
	isOpen,
	isOpening,
	isClosing,
	isLoading,
	setIsLoading,
	imageWithAlt,
	imgixParams,
	quality,
	title,
	children,
	onClose,
	onOpenComplete,
	onCloseComplete,
}) => {
	const transformRef = useRef(null);
	const wasPanningRef = useRef(false);
	const tapTimerRef = useRef(null);
	const rootRef = useRef(null);
	const [isZoomed, setIsZoomed] = useState(false);

	const isActive = isOpen || isOpening || isClosing;

	const handleClose = useCallback(() => {
		if (isOpening || !isOpen) return;
		transformRef.current?.resetTransform(0);
		setIsZoomed(false);
		onClose();
	}, [isOpen, isOpening, onClose]);

	const handleImageTap = useCallback(() => {
		if (!isActive || wasPanningRef.current) return;
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
				transformRef.current?.resetTransform(200);
			}
		}, 250);
	}, [handleClose, isActive]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			if (isOpen && !isLoading && (e.key === "Enter" || e.key === " ")) {
				e.preventDefault();
				handleClose();
			}
			if (isActive && e.key === "Escape") {
				handleClose();
			}
		};

		if (isActive) {
			document.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isActive, isOpen, isLoading, handleClose]);

	useEffect(() => {
		if (!isActive) return;

		if (isOpen && !isLoading) {
			onOpenComplete();
			return;
		}

		if (!isOpen && isClosing) {
			const timeoutId = window.setTimeout(onCloseComplete, 150);
			return () => window.clearTimeout(timeoutId);
		}
	}, [isActive, isOpen, isLoading, isClosing, onOpenComplete, onCloseComplete]);

	useEffect(() => {
		if (!isActive) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		rootRef.current?.focus();
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [isActive]);

	return (
		<div
			ref={rootRef}
			className={classNames(
				styles.mobileRoot,
				isActive && styles["mobileRoot--active"],
			)}
			aria-hidden={!isActive}
			role={isActive ? "dialog" : undefined}
			aria-modal={isActive ? "true" : undefined}
			aria-label={isActive ? `${title} - zoomable image` : undefined}
			tabIndex={isActive ? -1 : undefined}
		>
			<div
				className={classNames(
					styles.mobileOverlay,
					isActive && (isOpen || isOpening) && styles["mobileOverlay--visible"],
				)}
				onClick={isActive ? handleClose : undefined}
				role="presentation"
			/>
			<div className={styles.mobileModal}>
				<TransformWrapper
					ref={transformRef}
					minScale={1}
					maxScale={3}
					initialScale={1}
					centerOnInit
					limitToBounds
					disabled={!isActive}
					doubleClick={{ mode: "toggle", step: 2, animationTime: 200 }}
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
							{isActive && (
								<PrismicNextImage
									field={imageWithAlt}
									className="object-contain pointer-events-none"
									sizes="calc(100w - 3rem)"
									fill={true}
									priority
									onLoad={() => setIsLoading(false)}
									imgixParams={imgixParams}
									quality={quality}
								/>
							)}
						</div>
					</TransformComponent>
				</TransformWrapper>
			</div>
			{isActive && isOpen && !isLoading && (
				<button
					type="button"
					onClick={handleClose}
					aria-label="Close"
					className={styles.mobileClose}
				>
					<X size={20} strokeWidth={2} />
				</button>
			)}
			{isActive && isOpen && !isLoading && !isZoomed && children && (
				<div className={styles.mobileFooter}>{children}</div>
			)}
		</div>
	);
};

const SketchplanationLightbox = (props) => {
	const isMobile = useIsMobile();

	if (!isMobile) {
		return <SketchplanationLightboxDesktop {...props} />;
	}

	return <SketchplanationLightboxMobile {...props} />;
};

export default SketchplanationLightbox;
