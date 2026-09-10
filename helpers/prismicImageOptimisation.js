const JPEG_URL_PATTERN = /\.jpe?g($|[?&])/i;

export const JPEG_PRISMIC_IMAGE_QUALITY = 95;

export function isJpegPrismicImage(image) {
	return Boolean(image?.url?.match(JPEG_URL_PATTERN));
}

/**
 * imgix recompresses JPEG uploads aggressively unless we raise quality.
 * PNG uploads are left on imgix defaults. Sketch pages already did this
 * in SketchplanationImage (#565); list/home cards were still on defaults.
 */
export function getPrismicImageOptimisation(image, baseImgixParams = {}) {
	if (isJpegPrismicImage(image)) {
		return {
			imgixParams: { auto: "format", ...baseImgixParams },
			quality: JPEG_PRISMIC_IMAGE_QUALITY,
		};
	}

	return {
		imgixParams:
			Object.keys(baseImgixParams).length > 0 ? baseImgixParams : undefined,
		quality: undefined,
	};
}
