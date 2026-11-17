const JPEG_URL_PATTERN = /\.jpe?g($|[?&])/i;

export const JPEG_PRISMIC_IMAGE_QUALITY = 95;

export function isJpegPrismicImage(image) {
	return Boolean(image?.url?.match(JPEG_URL_PATTERN));
}

/**
 * JPEG uploads are a poor fit for flat-colour illustrations: imgix recompresses
 * them aggressively and edges/text pick up blocky artefacts. Re-encode as WebP
 * at higher quality instead (similar bytes, much sharper). PNG uploads are left
 * on imgix defaults.
 */
export function getPrismicImageOptimisation(image, baseImgixParams = {}) {
	if (isJpegPrismicImage(image)) {
		return {
			imgixParams: { auto: "format", fm: "webp", ...baseImgixParams },
			quality: JPEG_PRISMIC_IMAGE_QUALITY,
		};
	}

	return {
		imgixParams:
			Object.keys(baseImgixParams).length > 0 ? baseImgixParams : undefined,
		quality: undefined,
	};
}

/**
 * Imgix params sized to the uploaded image dimensions so “Copy image” on mobile
 * and context menus paste the full sketch, not a layout-width variant.
 */
export function getPrismicFullSizeImageOptimisation(image, baseImgixParams = {}) {
	const { imgixParams, quality } = getPrismicImageOptimisation(
		image,
		baseImgixParams,
	);
	const width = image?.dimensions?.width;
	const height = image?.dimensions?.height;

	if (!width || !height) {
		return { imgixParams, quality };
	}

	return {
		imgixParams: {
			...(imgixParams ?? {}),
			w: width,
			h: height,
			fit: "max",
		},
		quality,
	};
}

/**
 * `sizes` value that steers `srcset` toward the image’s native width for copy/paste.
 */
export function getPrismicImageCopySizes(image) {
	const width = image?.dimensions?.width;
	if (width) {
		return `(min-width: 1px) ${width}px`;
	}

	return "100vw";
}
