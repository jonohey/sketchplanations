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
				{
					...props,
					style: { position: 'relative', display: 'inline-block' }
				},
				<RoughNotation
					show={show}
					iterations={1}
					animate={false}
					strokeWidth={2}
					padding={2}
					type="underline"
				>
					<span style={{ whiteSpace: 'nowrap', position: 'relative', zIndex: 1 }}>
						{children}
					</span>
				</RoughNotation>
			)}
		</div>
	);
};

export default TextHeader;
