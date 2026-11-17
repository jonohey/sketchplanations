import { describe, expect, it } from "vitest";

import {
	JPEG_PRISMIC_IMAGE_QUALITY,
	getPrismicImageOptimisation,
	getPrismicScreenSizeImageOptimisation,
	SKETCH_IMAGE_SCREEN_MAX_PX,
	isJpegPrismicImage,
} from "../../helpers/prismicImageOptimisation";

describe("isJpegPrismicImage", () => {
	it("detects JPEG URLs", () => {
		expect(
			isJpegPrismicImage({
				url: "https://images.prismic.io/sketchplanations/example.jpg",
			}),
		).toBe(true);
		expect(
			isJpegPrismicImage({
				url: "https://images.prismic.io/sketchplanations/example.jpeg?auto=format",
			}),
		).toBe(true);
	});

	it("ignores PNG and other formats", () => {
		expect(
			isJpegPrismicImage({
				url: "https://images.prismic.io/sketchplanations/example.png",
			}),
		).toBe(false);
	});
});

describe("getPrismicImageOptimisation", () => {
	it("re-encodes JPEG uploads as WebP at high quality", () => {
		expect(
			getPrismicImageOptimisation({
				url: "https://images.prismic.io/sketchplanations/example.jpg",
			}),
		).toEqual({
			imgixParams: { auto: "format", fm: "webp" },
			quality: JPEG_PRISMIC_IMAGE_QUALITY,
		});
	});

	it("merges crop params for JPEG thumbnails", () => {
		expect(
			getPrismicImageOptimisation(
				{
					url: "https://images.prismic.io/sketchplanations/example.jpg",
				},
				{ fit: "crop", crop: "top", ar: "1:1" },
			),
		).toEqual({
			imgixParams: {
				auto: "format",
				fm: "webp",
				fit: "crop",
				crop: "top",
				ar: "1:1",
			},
			quality: JPEG_PRISMIC_IMAGE_QUALITY,
		});
	});

	it("leaves PNG images on imgix defaults", () => {
		expect(
			getPrismicImageOptimisation({
				url: "https://images.prismic.io/sketchplanations/example.png",
			}),
		).toEqual({
			imgixParams: undefined,
			quality: undefined,
		});
	});

	it("keeps non-JPEG crop params without quality override", () => {
		expect(
			getPrismicImageOptimisation(
				{
					url: "https://images.prismic.io/sketchplanations/example.png",
				},
				{ fit: "crop", crop: "top", ar: "5:3" },
			),
		).toEqual({
			imgixParams: { fit: "crop", crop: "top", ar: "5:3" },
			quality: undefined,
		});
	});
});

describe("getPrismicScreenSizeImageOptimisation", () => {
	it("leaves small uploads uncropped", () => {
		expect(
			getPrismicScreenSizeImageOptimisation({
				url: "https://images.prismic.io/sketchplanations/example.png",
				dimensions: { width: 1200, height: 900 },
			}),
		).toEqual({
			imgixParams: { w: 1200, h: 900, fit: "max" },
			quality: undefined,
		});
	});

	it(`caps wide sketches at ${SKETCH_IMAGE_SCREEN_MAX_PX}px (download medium)`, () => {
		expect(
			getPrismicScreenSizeImageOptimisation({
				url: "https://images.prismic.io/sketchplanations/example.png",
				dimensions: { width: 3200, height: 2400 },
			}),
		).toEqual({
			imgixParams: { w: 1920, h: 1440, fit: "max" },
			quality: undefined,
		});
	});

	it("merges JPEG re-encode params when capping", () => {
		expect(
			getPrismicScreenSizeImageOptimisation({
				url: "https://images.prismic.io/sketchplanations/example.jpg",
				dimensions: { width: 2500, height: 1600 },
			}),
		).toEqual({
			imgixParams: {
				auto: "format",
				fm: "webp",
				w: 1920,
				h: 1229,
				fit: "max",
			},
			quality: JPEG_PRISMIC_IMAGE_QUALITY,
		});
	});
});
