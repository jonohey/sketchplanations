import { createElement, useEffect, useState } from "react";
import { RoughNotation } from "react-rough-notation";

import styles from "./TextHeader.module.css";

const TextHeader = ({ as = "h1", children, ...props }) => {
	const [show, setShow] = useState(true);

	useEffect(() => {
		let resizeTimeout;
		let lastWidth = window.innerWidth;
		let lastHeight = window.innerHeight;

		const handleResize = () => {
			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight;
			const widthDiff = Math.abs(newWidth - lastWidth);
			const heightDiff = Math.abs(newHeight - lastHeight);

			if (widthDiff > 0 || heightDiff > 100) {
				setShow(false);
				clearTimeout(resizeTimeout);
				resizeTimeout = setTimeout(() => {
					setShow(true);
					lastWidth = newWidth;
					lastHeight = newHeight;
				}, 500);
			}
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div className={styles.root}>
			{createElement(
				as,
				props,
				<RoughNotation
					show={show}
					iterations={1}
					animate={false}
					// animationDuration={500}
					// animationDelay={250}
					strokeWidth={2}
					multiline
					padding={2}
				>
					{children}
				</RoughNotation>,
			)}
		</div>
	);
};

export default TextHeader;
