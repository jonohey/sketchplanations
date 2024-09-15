"use client";

import {
	flip,
	inline,
	offset,
	shift,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
	useTransitionStyles,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { PrismicNextImage } from "@prismicio/next";
import sketchTooltipsData from "data/sketch-tooltips-data.json";

const SketchTooltip = ({ uid, children }) => {
	const [isOpen, setIsOpen] = useState();
	const [imageLoaded, setImageLoaded] = useState(false);

	const image = sketchTooltipsData.find(({ uid: dataUid }) => dataUid === uid);

	if (!uid || !image) return null;

	const { refs, context, floatingStyles } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: "bottom",
		middleware: [
			offset({
				mainAxis: 18,
				crossAxis: 24,
			}),
			flip(),
			shift(10),
			inline(),
		],
	});

	const hover = useHover(context, {
		delay: {
			open: 100,
			close: 0,
		},
	});
	const focus = useFocus(context);

	const { isMounted, styles } = useTransitionStyles(context, {
		duration: 200,
		initial: {
			opacity: 0,
		},
		open: {
			opacity: 1,
		},
		close: {
			opacity: 0,
		},
	});

	const { getReferenceProps, getFloatingProps } = useInteractions([
		hover,
		focus,
	]);

	// const randomRotate = useMemo(() => Math.random() * 10 - 5, [isMounted]);
	// const getRandomRotate = useCallback(() => Math.random() * 10 - 5, []);

	const [rotate, setRotate] = useState(0);

	useEffect(() => {
		if (isMounted) {
			setRotate(Math.random() * 10 - 5);
		}
	}, [isMounted]);

	return (
		<>
			<span ref={refs.setReference} {...getReferenceProps()}>
				{children}
			</span>
			{isMounted && image && (
				<span
					ref={refs.setFloating}
					style={{ ...floatingStyles, ...styles }}
					{...getFloatingProps()}
					className="block pointer-events-none not-prose"
				>
					<AnimatePresence>
						{isMounted && (
							<motion.span
								className="block"
								initial={{
									scale: 0.9,
									rotate: 0,
									y: 20,
									opacity: 0,
								}}
								animate={{
									scale: 1,
									rotate,
									y: 0,
									opacity: imageLoaded ? 1 : 0,
								}}
								exit={{
									scale: 0.9,
									rotate: 0,
									y: 20,
									opacity: 0,
								}}
								transition={{
									type: "spring",
									stiffness: 100,
									damping: 5,
									mass: 0.1,
								}}
							>
								{image ? (
									<span className="block rounded shadow-md overflow-hidden relative w-[10rem] aspect-[5/3]">
										<PrismicNextImage
											field={image.image}
											className="w-full h-full"
											width="10rem"
											height="10rem"
											imgixParams={{
												fit: "crop",
												crop: "top",
												ar: "5:3",
												dpr:
													typeof window !== "undefined"
														? window.devicePixelRatio || 2
														: 2,
											}}
											alt={image.alt}
											fallbackAlt=""
											sizes="10rem"
											onLoad={() => setImageLoaded(true)}
										/>
									</span>
								) : (
									<span className="block mx-auto p-4">
										<LoaderCircle className="animate-spin" strokeWidth={1} />
									</span>
								)}
							</motion.span>
						)}
					</AnimatePresence>
				</span>
			)}
		</>
	);
};

export default SketchTooltip;
