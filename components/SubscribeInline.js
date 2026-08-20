import { useInView } from "react-intersection-observer";

import styles from "./SubscribeInline.module.css";

const SUBSTACK_EMBED_URL = "https://sketchplanations.substack.com/embed";

const SubscribeInline = () => {
	const { ref, inView } = useInView({
		triggerOnce: true,
		rootMargin: "200px",
	});

	return (
		<div className={styles.root} ref={ref}>
			<p className="text-center mb-3">👇 Get new sketches each week</p>
			{inView ? (
				<iframe
					className={styles.shadow}
					src={SUBSTACK_EMBED_URL}
					title="Substack subscription"
					width="100%"
					height="150"
					loading="lazy"
					style={{
						border: "1px solid #EEE",
						background: "white",
						overflow: "hidden",
					}}
				/>
			) : (
				<div
					className={styles.placeholder}
					style={{ height: 150 }}
					aria-hidden
				/>
			)}
		</div>
	);
};

export default SubscribeInline;
