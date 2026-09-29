import { createElement } from "react";

import styles from "./TextHeader.module.css";

const TextHeader = ({ as = "h1", children, ...props }) => {
	return (
		<div className={styles.root}>
			{createElement(as, props, children)}
		</div>
	);
};

export default TextHeader;
