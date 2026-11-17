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

/** Responsive `sizes` for the main sketch on article pages (same as pre-lightbox layout). */
export const SKETCH_MAIN_IMAGE_SIZES =
	"(min-width: 66rem) 645px, (min-width: 64rem) 62w, (min-width: 40rem) calc(100w - 3rem), 100w";

/** Lightbox sketch image — viewport width, not native / print resolution. */
export const SKETCH_LIGHTBOX_IMAGE_SIZES = "calc(100w - 3rem)";

/**
 * Upper bound for sketch imgix requests in the UI. Matches `/api/dl?format=medium`
 * so long-press “Copy image” stays at a practical screen size, not the Prismic upload.
 */
export const SKETCH_IMAGE_SCREEN_MAX_PX = 1920;

/**
 * Imgix params capped for on-screen (and clipboard) use — same ballpark as
 * `/api/dl?format=medium`, not the full Prismic upload. Pair with
 * {@link SKETCH_MAIN_IMAGE_SIZES} or {@link SKETCH_LIGHTBOX_IMAGE_SIZES} so
 * `srcset` picks a layout-appropriate variant.
 */
export function getPrismicScreenSizeImageOptimisation(image, baseImgixParams = {}) {
	const { imgixParams, quality } = getPrismicImageOptimisation(
		image,
		baseImgixParams,
	);
	const nativeW = image?.dimensions?.width;
	const nativeH = image?.dimensions?.height;

	if (!nativeW || !nativeH) {
		return { imgixParams, quality };
	}

	const max = SKETCH_IMAGE_SCREEN_MAX_PX;
	const w = Math.min(nativeW, max);
	const h = Math.round((nativeH / nativeW) * w);

	return {
		imgixParams: {
			...(imgixParams ?? {}),
			w,
			h,
			fit: "max",
		},
		quality,
	};
}
