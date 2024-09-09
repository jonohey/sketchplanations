import { useEffect, useState } from "react";

const prismicDocsToPhotos = (results) => {
	try {
		return results.map(
			({
				uid,
				data: {
					title,
					image: {
						url,
						alt,
						dimensions: { width, height },
					},
				},
			}) => ({
				src: url,
				width,
				height,
				alt: alt || `${title} - Sketchplanations`,
				uid,
			}),
		);
	} catch {
		console.log("Something went wrong:", results);
		return [];
	}
};

const useGalleryPhotos = (prismicDocs) => {
	const [photos, setPhotos] = useState([]);

	useEffect(() => {
		setPhotos(prismicDocsToPhotos(prismicDocs));
	}, [prismicDocs]);

	return photos;
};

export default useGalleryPhotos;
