
const SubscribeFull = () => {
	return (
		<div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center" id="substack-subscribe-strip">
			<iframe 
				src="https://sketchplanations.substack.com/embed" 
				title="Substack subscription form"
				width="480" 
				height="320" 
				style={{ 
					border: '1px solid #EEE', 
					background: 'white',
					overflow: 'hidden'
				}}
			/>
		</div>
	);
};

export default SubscribeFull; 