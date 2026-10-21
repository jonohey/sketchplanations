/**
 * Width-constrained Prismic/imgix URL for a sketch image. Used where an
 * absolute, shareable image URL is needed (sitemap, agent files).
 */
export const sketchImageUrl = (image, width = 1200) => {
	if (!image?.url) return null;

	try {
		const url = new URL(image.url);
		url.searchParams.set("w", String(width));
		return url.toString();
	} catch {
		return `${image.url}${image.url.includes("?") ? "&" : "?"}w=${width}`;
	}
};
