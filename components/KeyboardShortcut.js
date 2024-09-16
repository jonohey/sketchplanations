import styles from "./KeyboardShortcut.module.css";

const KeyboardShortcut = ({ shortcut, icon }) => {
	return <kbd className={styles.root}>{icon || shortcut}</kbd>;
};

export default KeyboardShortcut;
