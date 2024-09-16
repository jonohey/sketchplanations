import { motion, useScroll } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import styles from "./BuyMeACoffee.module.css";

const variants = {
	hidden: {
		opacity: 0,
		x: -100,
		scale: 0.8,
		transition: { duration: 0.1, ease: "linear" },
	},
	visible: {
		opacity: 1,
		x: 0,
		scale: 1,
		transition: {
			type: "spring",
			stiffness: 100,
			damping: 5,
			mass: 0.1,
		},
	},
};

import Context from "context";

const BuyMeACoffee = () => {
	const { decorationHidden } = useContext(Context);
	const { scrollYProgress } = useScroll();
	const [isShown, setIsShown] = useState(false);

	useEffect(() => {
		const unsubscribe = scrollYProgress.onChange((v) => {
			setIsShown(v > 0.5);
		});

		return () => unsubscribe();
	}, [scrollYProgress]);

	return (
		<motion.div
			className={styles.coffee}
			initial="hidden"
			animate={decorationHidden ? "hidden" : isShown ? "visible" : "hidden"}
			variants={variants}
		>
			<a
				href="https://www.buymeacoffee.com/sketchplanator"
				target="_blank"
				rel="noreferrer"
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					className={styles.image}
					src="/bmc.svg"
					width="4169"
					height="913"
					alt="Buy Me A Coffee"
				/>
			</a>
		</motion.div>
	);
};

export default BuyMeACoffee;
