const JsonLd = ({ data }) => {
	if (!data) return null;

	return (
		<script
			type="application/ld+json"
			// JSON-LD must be a raw script body; React escapes as needed for text content.
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	);
};

export default JsonLd;
