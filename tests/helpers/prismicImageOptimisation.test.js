import { describe, expect, it } from "vitest";

import {
	JPEG_PRISMIC_IMAGE_QUALITY,
	getPrismicFullSizeImageOptimisation,
	getPrismicImageCopySizes,
	getPrismicImageOptimisation,
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

describe("getPrismicFullSizeImageOptimisation", () => {
	it("caps at native dimensions for copy-friendly URLs", () => {
		expect(
			getPrismicFullSizeImageOptimisation({
				url: "https://images.prismic.io/sketchplanations/example.png",
				dimensions: { width: 2000, height: 1500 },
			}),
		).toEqual({
			imgixParams: { w: 2000, h: 1500, fit: "max" },
			quality: undefined,
		});
	});

	it("merges JPEG re-encode params with full-size dimensions", () => {
		expect(
			getPrismicFullSizeImageOptimisation({
				url: "https://images.prismic.io/sketchplanations/example.jpg",
				dimensions: { width: 1800, height: 1200 },
			}),
		).toEqual({
			imgixParams: {
				auto: "format",
				fm: "webp",
				w: 1800,
				h: 1200,
				fit: "max",
			},
			quality: JPEG_PRISMIC_IMAGE_QUALITY,
		});
	});
});

describe("getPrismicImageCopySizes", () => {
	it("uses native width in sizes when dimensions are known", () => {
		expect(
			getPrismicImageCopySizes({
				dimensions: { width: 2400, height: 1800 },
			}),
		).toBe("(min-width: 1px) 2400px");
	});
});
