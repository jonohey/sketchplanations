import styles from "./SubscribeInline.module.css";

const SubscribeInline = () => {
	return (
		<div className={styles.root}>
			<iframe 
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
