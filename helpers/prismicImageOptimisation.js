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
