import styles from "./SubscribeInline.module.css";

const SubscribeInline = () => {
	return (
		<div className={styles.root}>
			<p className="text-center mb-3">👇 Get new sketches each week</p>
			<iframe 
				className={styles.shadow}
				src="https://sketchplanations.substack.com/embed" 
				title="Substack subscription"
				width="100%" 
				height="150" 
				style={{ 
					border: '1px solid #EEE', 
					background: 'white',
					overflow: 'hidden'
				}}
			/>
		</div>
	);
};

export default SubscribeInline;
