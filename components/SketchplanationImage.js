import { PrismicNextImage } from "@prismicio/next";
import { track } from "@vercel/analytics";
import { LoaderCircle } from "lucide-react";
import dynamic from "next/dynamic";
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import Context from "context";
import runWhenIdle from "helpers/runWhenIdle";
import styles from "./SketchplanationImage.module.css";

const SketchplanationLightbox = dynamic(
	() => import("components/SketchplanationLightbox"),
	{ ssr: false },
);

const SketchplanationImage = ({ image, title, priority = false, children }) => {
	const { width, height } = image.dimensions
		? image
		: { width: undefined, height: undefined };

	const { setDecorationHidden } = useContext(Context);

	const imageRef = useRef(null);
	const cachedImageRectRef = useRef({});

	const [isOpen, setIsOpen] = useState(false);
	const [initialImageRect, setInitialImageRect] = useState({});
	const [isOpening, setIsOpening] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isLightboxReady, setIsLightboxReady] = useState(false);

	useEffect(() => {
		const imageElement = imageRef.current;
		if (!imageElement) return;

		const updateCachedRect = () => {
			cachedImageRectRef.current = imageElement.getBoundingClientRect();
		};

		updateCachedRect();
		const resizeObserver = new ResizeObserver(updateCachedRect);
		resizeObserver.observe(imageElement);

		return () => resizeObserver.disconnect();
	}, []);

	useEffect(() => {
		return runWhenIdle(() => {
			import("components/SketchplanationLightbox").then(() => {
				setIsLightboxReady(true);
			});
		});
	}, []);

	const ensureLightboxReady = useCallback(() => {
		if (isLightboxReady) return Promise.resolve();
		return import("components/SketchplanationLightbox").then(() => {
			setIsLightboxReady(true);
		});
	}, [isLightboxReady]);

	const open = () => {
		setInitialImageRect({ ...cachedImageRectRef.current });
		setIsOpening(true);
		setIsOpen(true);
		setDecorationHidden(true);
		if (!isLoading) setIsLoading(true);
		ensureLightboxReady();
		runWhenIdle(() => track("lightbox_open", { sketch: title }));
	};

	const close = useCallback(() => {
		if (isOpening || !isOpen) return;
		setIsClosing(true);
		setIsOpen(false);
	}, [isOpen, isOpening]);

	const handleOpenComplete = useCallback(() => {
		setIsOpening(false);
	}, []);

	const handleCloseComplete = useCallback(() => {
		setIsClosing(false);
		setDecorationHidden(false);
	}, [setDecorationHidden]);

	const opacity = useMemo(() => {
		if (isOpen) {
			if (isLoading) return 1;
			return 0;
		}

		if (isOpening || isClosing) return 0;

		return 1;
	}, [isOpen, isOpening, isClosing, isLoading]);

	const isJpg = image.url.match(/\.jpe?g($|[?&])/i);
	const imgixParams = isJpg ? { auto: "format" } : undefined;
	const quality = isJpg ? 95 : undefined;

	const fallbackAlt = `${title} - Sketchplanations`;
	const imageWithAlt = {
		...image,
		alt: image.alt || fallbackAlt,
	};

	return (
		<>
			<div className="relative">
				<PrismicNextImage
					field={imageWithAlt}
					className={`bg-paper cursor-zoom-in mx-auto transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 ${styles.thumb}`}
					ref={imageRef}
					width={width}
					height={height}
					sizes="(min-width: 66rem) 645px, (min-width: 64rem) 62w, (min-width: 40rem) calc(100w - 3rem), 100w"
					priority={priority}
					onClick={open}
					role="button"
					tabIndex="0"
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							open();
						}
					}}
					style={{
						opacity,
					}}
					imgixParams={imgixParams}
					quality={quality}
				/>
				{(isOpening || (isOpen && isLoading)) && (
					<div className={styles.thumbLoader}>
						<LoaderCircle
							className="animate-spin"
							strokeWidth={1}
							size={((initialImageRect.width || 0) / 100) * 19}
						/>
					</div>
				)}
			</div>
			{isLightboxReady && (
				<SketchplanationLightbox
					isOpen={isOpen}
					isOpening={isOpening}
					isClosing={isClosing}
					isLoading={isLoading}
					setIsLoading={setIsLoading}
					initialImageRect={initialImageRect}
					imageWithAlt={imageWithAlt}
					imgixParams={imgixParams}
					quality={quality}
					title={title}
					onClose={close}
					onOpenComplete={handleOpenComplete}
					onCloseComplete={handleCloseComplete}
				>
					{children}
				</SketchplanationLightbox>
			)}
		</>
	);
};

export default SketchplanationImage;
