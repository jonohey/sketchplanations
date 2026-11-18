import { useInView } from "react-intersection-observer";

import styles from "./SubscribeInline.module.css";

const SUBSTACK_EMBED_URL = "https://sketchplanations.substack.com/embed";

// `full` shows Substack's whole widget (avatar, description, subscriber
// count); the default is cropped to just the email form.
const SubscribeInline = ({
	label = "👇 Get new sketches each week",
	full = false,
}) => {
	const height = full ? 320 : 150;

	const { ref, inView } = useInView({
		triggerOnce: true,
		rootMargin: "200px",
	});

	return (
		<div className={styles.root} ref={ref}>
			{label && <p className="text-center mb-3">{label}</p>}
			{inView ? (
				<iframe
					className={styles.shadow}
					src={SUBSTACK_EMBED_URL}
					title="Substack subscription"
					width="100%"
					height={height}
					loading="lazy"
					style={{
						border: "1px solid #EEE",
						background: "white",
						overflow: "hidden",
					}}
				/>
			) : (
				<div className={styles.placeholder} style={{ height }} aria-hidden />
			)}
		</div>
	);
};

export default SubscribeInline;
