import { AnimatePresence, motion } from "framer-motion";
import { debounce } from "lodash";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

const MotionModal = motion.create(Modal);
const MotionImage = motion.create(Image);

import Context from "context";
import { X } from "lucide-react";

const SketchplanationImage = ({ image, title, priority = false, children }) => {
	const { width, height } = image.dimensions;

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

		const { scale, positionX, positionY } =
			transformWrapperRef.current.instance.transformState;

		if (scale !== 1 || positionX !== 0 || positionY !== 0) {
			transformWrapperRef.current.resetTransform();
			setTimeout(() => {
				setIsClosing(true);
				setIsOpen(false);
			}, 200);
		} else {
			setIsClosing(true);
			setIsOpen(false);
		}
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

	const transformWrapperRef = useRef(null);

	const touchCountRef = useRef(0);

	const handlePointerDown = useCallback(() => {
		touchCountRef.current++;
	}, []);

	const handlePointerUp = useCallback(() => {
		touchCountRef.current = Math.max(0, touchCountRef.current - 1);

		if (touchCountRef.current === 0) {
			const { scale } = transformWrapperRef.current.instance.transformState;
			if (scale === 1) {
				close();
			}
		}
	}, [close]);

	return (
		<>
			<div className="relative">
				<Image
					className="bg-paper cursor-zoom-in mx-auto"
					ref={imageRef}
					src={image.url}
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
						// boxShadow: "0 2.3rem 1rem -2rem var(--color-sketchShadow)",
						boxShadow: "0 2.3rem 1rem -2rem hsla(0, 0%, 0%, 0.1)",
					}}
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
									top: "0",
									left: "0",
									width: "100vw",
									height: "calc(var(--visual-viewport-height) - 3rem)",
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
					<Dialog className="w-full h-full">
						<TransformWrapper
							disabled={!isOpen}
							ref={transformWrapperRef}
							minScale={1}
							maxScale={2}
							velocityAnimation={{
								disabled: true,
							}}
							wheel={{
								smoothStep: 0.004,
							}}
							panning={{
								wheelPanning: true,
								velocityDisabled: true,
							}}
							doubleClick={{
								mode: "toggle",
							}}
						>
							<TransformComponent
								wrapperStyle={{ width: "100%", height: "100%" }}
								contentStyle={{ width: "100%", height: "100%" }}
								contentProps={{
									onPointerDown: handlePointerDown,
									onPointerUp: handlePointerUp,
									onPointerCancel: handlePointerUp,
								}}
							>
								<MotionImage
									className="object-contain cursor-zoom-out"
									src={image.url}
									alt={image.alt || `${title} - Sketchplanations`}
									// sizes="calc(100vw - 3rem)"
									sizes="100vw"
									fill={true}
									priority
									onLoad={() => setIsLoading(false)}
								/>
							</TransformComponent>
						</TransformWrapper>
					</Dialog>
					<AnimatePresence>
						{isOpen && !isLoading && (
							<motion.div
								className="fixed z-20 top-0 left-0 right-0 flex items-center justify-end h-12 px-2"
								initial={{
									opacity: 0,
								}}
								animate={{
									opacity: 1,
								}}
								exit={{
									opacity: 0,
								}}
								transition={{
									duration: 0.2,
								}}
							>
								<button
									type="button"
									onClick={close}
									className="bg-[hsla(0,0%,0%,0.5)] backdrop-blur-lg p-2 rounded-full font-semibold text-sm text-white"
								>
									<span className="sr-only px-1">Close</span>
									<X size={16} />
								</button>
							</motion.div>
						)}
						{isOpen && !isLoading && (
							<motion.div
								className="fixed z-20 bottom-0 left-0 right-0 flex items-center justify-center h-12 border-t border-[rgba(255,255,255,0.05)] backdrop-blur-sm"
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
