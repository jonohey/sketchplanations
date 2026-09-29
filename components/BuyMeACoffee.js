import classNames from "classnames";
import { useContext, useEffect, useState } from "react";
import styles from "./BuyMeACoffee.module.css";

import Context from "context";

const BuyMeACoffee = () => {
	const { decorationHidden } = useContext(Context);
	const [isShown, setIsShown] = useState(false);

	useEffect(() => {
		let ticking = false;

		const update = () => {
			ticking = false;
			const scrollingElement = document.documentElement;
			const scrollable = scrollingElement.scrollHeight - scrollingElement.clientHeight;
			const progress = scrollable > 0 ? scrollingElement.scrollTop / scrollable : 0;
			setIsShown(progress > 0.5);
		};

		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			window.requestAnimationFrame(update);
		};

		update();
		window.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", onScroll);
		};
	}, []);

	return (
		<div
			className={classNames(
				styles.coffee,
				isShown && !decorationHidden && styles.coffeeVisible,
			)}
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
					width="120"
					height="26"
					alt="Buy Me A Coffee"
				/>
			</a>
		</div>
	);
};

export default BuyMeACoffee;
