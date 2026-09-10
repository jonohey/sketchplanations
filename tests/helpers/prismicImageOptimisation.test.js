import { describe, expect, it } from "vitest";
import {
	getPrismicImageOptimisation,
	isJpegPrismicImage,
	JPEG_PRISMIC_IMAGE_QUALITY,
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
	it("raises JPEG quality and sets auto=format", () => {
		expect(
			getPrismicImageOptimisation({
				url: "https://images.prismic.io/sketchplanations/example.jpg",
			}),
		).toEqual({
			imgixParams: { auto: "format" },
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
