import { createElement, useEffect, useState } from "react";
import { RoughNotation } from "react-rough-notation";

import styles from "./TextHeader.module.css";

const TextHeader = ({ as = "h1", children, ...props }) => {
	const [show, setShow] = useState(true);

	useEffect(() => {
		// On window resize, hide the annotation until resizing is done
		const handleResize = () => {
			setShow(false);
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => setShow(true), 500);
		};

		let resizeTimeout;

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
					padding={3}
				>
					{children}
				</RoughNotation>,
			)}
		</div>
	);
};

export default TextHeader;
