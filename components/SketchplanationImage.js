import { PrismicNextImage } from "@prismicio/next";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import { LoaderCircle } from "lucide-react";
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";

const MotionModal = motion.create(Modal);
// const MotionDialog = motion.create(Dialog);
const MotionImage = motion.create(PrismicNextImage);

import Context from "context";

const SketchplanationImage = ({ image, title, priority = false, children }) => {
	const { width, height, url } = image.dimensions ? image : { width: undefined, height: undefined, url: image?.url };

	const { setDecorationHidden } = useContext(Context);

	const imageRef = useRef(null);

	const [isOpen, setIsOpen] = useState(false);
	const [initialImageRect, setInitialImageRect] = useState({});
	const [isOpening, setIsOpening] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const open = () => {
		setIsOpening(true);
		setIsOpen(true);
		setDecorationHidden(true);
		if (!isLoading) setIsLoading(true);
	};

	const close = useCallback(() => {
		if (isOpening || !isOpen) return;

		setIsClosing(true);
		setIsOpen(false);
	}, [isOpen, isOpening]);

	const getInitialImageDimensions = useCallback(() => {
		if (!imageRef.current) return;
		const rect = imageRef.current.getBoundingClientRect();
		setInitialImageRect(rect);
	}, []);

	useEffect(() => {
		getInitialImageDimensions();

		const debouncedGetDimensions = debounce(getInitialImageDimensions, 10);
		window.addEventListener("resize", debouncedGetDimensions);
		window.addEventListener("scroll", debouncedGetDimensions);

		return () => {
			window.removeEventListener("resize", debouncedGetDimensions);
			window.removeEventListener("scroll", debouncedGetDimensions);
			debouncedGetDimensions.cancel();
		};
	}, [getInitialImageDimensions]);

	const opacity = useMemo(() => {
		if (isOpen) {
			if (isLoading) return 1;

			return 0;
		}

		if (isOpening || isClosing) return 0;

		return 1;
	}, [isOpen, isOpening, isClosing, isLoading]);

	const dialog = useRef(null);

	// Determine imgixParams based on file extension
	const isJpg = image.url.match(/\.jpe?g($|[?&])/i);
	const imgixParams = isJpg ? { auto: "format" } : undefined;
	const quality = isJpg ? 95 : undefined;

	return (
		<>
			<div className="relative">
				<PrismicNextImage
					field={image}
					className="bg-paper cursor-zoom-in mx-auto"
					ref={imageRef}
					width={width}
					height={height}
					alt={image.alt || `${title} - Sketchplanations`}
					sizes="(min-width: 66rem) 645px, (min-width: 64rem) 62w, (min-width: 40rem) calc(100w - 3rem), 100w"
					priority={priority}
					onClick={open}
					role="button"
					tabIndex="0"
					style={{
						opacity,
						boxShadow: "0 2.3rem 1rem -2rem hsla(0, 0%, 0%, 0.1)",
					}}
					imgixParams={imgixParams}
					quality={quality}
				/>
				<motion.div
					className="absolute inset-0 flex items-center justify-center text-bg pointer-events-none backdrop-blur-lg"
					style={{
						maskImage: "radial-gradient(#000, transparent)",
						containerType: "inline-size",
					}}
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: isLoading ? 1 : 0,
					}}
				>
					<motion.div>
						<LoaderCircle
							className="animate-spin"
							strokeWidth={1}
							size={((initialImageRect.width || 0) / 100) * 19}
						/>
					</motion.div>
				</motion.div>
			</div>
			<ModalOverlay
				isOpen={isOpen || isOpening || isClosing}
				isDismissable
				onOpenChange={close}
			>
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
					style={{ opacity: opacity === 1 ? 0 : 1 }}
					initial={{
						top: initialImageRect.top,
						left: initialImageRect.left,
						width: initialImageRect.width,
						height: initialImageRect.height,
					}}
					onAnimationComplete={() => {
						if (isOpen) {
							setIsOpening(false);
						} else {
							setIsClosing(false);
							setDecorationHidden(false);
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
					>
						<PrismicNextImage
							field={image}
							className="object-contain cursor-zoom-out"
							alt={image.alt || `${title} - Sketchplanations`}
							sizes="calc(100w - 3rem)"
							fill={true}
							onClick={close}
							priority
							onLoad={() => setIsLoading(false)}
							imgixParams={imgixParams}
							quality={quality}
						/>
					</Dialog>
					<AnimatePresence>
						{isOpen && !isLoading && (
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
		</>
	);
};

export default SketchplanationImage;
