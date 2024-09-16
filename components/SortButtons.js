import classNames from "classnames";

import styles from "./SortButtons.module.css";

const SortButtons = ({ options, value, onChange = () => {} }) => {
	return (
		<div className={styles["sort-buttons"]}>
			{options.map((option) => (
				<button
					key={option.label}
					className={classNames(
						styles["sort-button"],
						option.value === value && styles["sort-button-active"],
					)}
					onClick={() => onChange(option.value)}
				>
					{option.label}
				</button>
			))}
		</div>
	);
};

export default SortButtons;
