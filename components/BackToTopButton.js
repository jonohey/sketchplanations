import classNames from "classnames";
import { useEffect, useState } from "react";

import styles from "./BackToTopButton.module.css";

import { fastScrollToTop } from "helpers";

// Small floating "back to top" arrow for long pages. It fades in once the
// reader is a screen and a half down, so it stays out of the way near the top.
const BackToTopButton = () => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const update = () => setVisible(window.scrollY > window.innerHeight * 1.5);

		update();
		window.addEventListener("scroll", update, { passive: true });
		return () => window.removeEventListener("scroll", update);
	}, []);

	return (
		<button
			type="button"
			aria-label="Back to top"
			tabIndex={visible ? 0 : -1}
			onClick={() => fastScrollToTop()}
			className={classNames(styles.button, visible && styles.visible)}
		>
			<span aria-hidden="true">↑</span>
		</button>
	);
};

export default BackToTopButton;
