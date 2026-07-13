export const SITE_URL = "https://sketchplanations.com";

export const SITE_NAME = "Sketchplanations";

export const SITE_DESCRIPTION =
	"Sketchplanations explains the world one sketch at a time. Clear, simple sketches that break down ideas from science, creativity, psychology, and more.";

export const CREATOR = {
	"@type": "Person",
	name: "Jono Hey",
	url: `${SITE_URL}/about`,
};

export const CREATOR_SAME_AS = ["https://uk.linkedin.com/in/jonohey"];

export const ORGANIZATION_SAME_AS = [
	"https://www.instagram.com/sketchplanations/",
	"https://linkedin.com/company/sketchplanations",
	"https://www.threads.net/@sketchplanations",
	"https://bsky.app/profile/sketchplanations.bsky.social",
	"https://pinterest.com/sketchplanations",
	"https://twitter.com/sketchplanator",
	"https://sketchplanations.substack.com",
];

export const LICENSE_URL =
	"https://creativecommons.org/licenses/by-nc/4.0/";

export const COPYRIGHT_NOTICE =
	"Creative Commons Attribution-NonCommercial 4.0 International License";

const absoluteUrl = (path = "/") => {
	if (!path) return SITE_URL;
	if (/^https?:\/\//i.test(path)) return path;
	return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const buildOrganization = () => ({
	"@type": "Organization",
	"@id": `${SITE_URL}/#organization`,
	name: SITE_NAME,
	url: SITE_URL,
	logo: {
		"@type": "ImageObject",
		url: `${SITE_URL}/android-chrome-192x192.png`,
		width: 192,
		height: 192,
	},
	founder: CREATOR,
	sameAs: ORGANIZATION_SAME_AS,
});

export const buildWebSite = () => ({
	"@type": "WebSite",
	"@id": `${SITE_URL}/#website`,
	name: SITE_NAME,
	url: SITE_URL,
	description: SITE_DESCRIPTION,
	publisher: { "@id": `${SITE_URL}/#organization` },
	potentialAction: {
		"@type": "SearchAction",
		target: {
			"@type": "EntryPoint",
			urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
		},
		"query-input": "required name=search_term_string",
	},
});

export const buildSiteGraph = () => ({
	"@context": "https://schema.org",
	"@graph": [buildOrganization(), buildWebSite()],
});

export const buildPerson = ({
	url = `${SITE_URL}/about`,
	image = `${SITE_URL}/images/about/jono-hey-sketchplanations-headshot.jpg`,
} = {}) => ({
	"@context": "https://schema.org",
	"@type": "Person",
	"@id": `${SITE_URL}/about#person`,
	name: "Jono Hey",
	url,
	image,
	jobTitle: "Creator of Sketchplanations",
	description:
		"Creator of Sketchplanations and author of Big Ideas Little Pictures.",
	sameAs: CREATOR_SAME_AS,
	worksFor: {
		"@type": "Organization",
		name: SITE_NAME,
		url: SITE_URL,
	},
});

/**
 * Build ImageObject dimensions for a width-constrained Prismic/imgix URL.
 * When serving `&w=1200`, height should match that derivative, not the original.
 */
export const imageDimensionsForWidth = (dimensions, targetWidth = 1200) => {
	if (!dimensions?.width || !dimensions?.height) return null;
	const width = Math.min(targetWidth, dimensions.width);
	const height = Math.round((width / dimensions.width) * dimensions.height);
	return { width, height };
};

export const buildSketchImageObject = ({
	uid,
	title,
	description,
	image,
	publishedAt,
	contentWidth = 1200,
}) => {
	const pageUrl = absoluteUrl(`/${uid}`);
	const contentUrl = `${image.url}&w=${contentWidth}`;
	const dims = imageDimensionsForWidth(image.dimensions, contentWidth);

	return {
		"@type": "ImageObject",
		"@id": `${pageUrl}#image`,
		contentUrl,
		url: contentUrl,
		name: title,
		caption: image.alt || title,
		description,
		...(dims && { width: dims.width, height: dims.height }),
		thumbnail: {
			"@type": "ImageObject",
			url: `${image.url}&w=200`,
		},
		creator: CREATOR,
		creditText: "Jono Hey",
		copyrightNotice: COPYRIGHT_NOTICE,
		license: LICENSE_URL,
		acquireLicensePage: `${SITE_URL}/licence`,
		isFamilyFriendly: true,
		representativeOfPage: true,
		...(publishedAt && { datePublished: publishedAt }),
		mainEntityOfPage: pageUrl,
	};
};

/**
 * Prismic content relationships can be broken (deleted tag docs) or empty.
 * Those must not become breadcrumb/category URLs. CI also fails on them via
 * `npm run check:broken-tags` — this filter is a safety net for SEO only.
 */
export const resolveSketchTagDocs = (tags = []) =>
	tags
		.map((entry) => entry?.tag)
		.filter((tag) => {
			if (!tag?.id || tag.isBroken === true || tag.type === "broken_type") {
				return false;
			}
			const slug = (tag.uid || tag.slug || "").trim();
			if (!slug || slug === "-") return false;
			const name = slug.replace(/-/g, " ").trim();
			return Boolean(name);
		});

export const tagLabelFromDoc = (tag) => {
	const slug = (tag?.uid || tag?.slug || "").trim();
	return slug.replace(/-/g, " ").trim();
};

export const buildSketchCreativeWork = ({
	uid,
	title,
	description,
	publishedAt,
	tags = [],
}) => {
	const pageUrl = absoluteUrl(`/${uid}`);
	const keywords = resolveSketchTagDocs(tags).map(tagLabelFromDoc).filter(Boolean);

	return {
		"@type": ["CreativeWork", "Article"],
		"@id": `${pageUrl}#creativework`,
		headline: title,
		name: title,
		description,
		url: pageUrl,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": pageUrl,
		},
		image: { "@id": `${pageUrl}#image` },
		author: CREATOR,
		creator: CREATOR,
		publisher: { "@id": `${SITE_URL}/#organization` },
		license: LICENSE_URL,
		isAccessibleForFree: true,
		isFamilyFriendly: true,
		...(publishedAt && {
			datePublished: publishedAt,
			dateModified: publishedAt,
		}),
		...(keywords.length > 0 && {
			keywords: keywords.join(", "),
			about: keywords.map((name) => ({
				"@type": "Thing",
				name,
			})),
		}),
	};
};

export const buildSketchBreadcrumbs = ({ uid, title, primaryTag } = {}) => {
	const items = [
		{
			"@type": "ListItem",
			position: 1,
			name: "Home",
			item: `${SITE_URL}/`,
		},
	];

	const categorySlug = primaryTag?.slug?.trim();
	const categoryName = primaryTag?.name?.trim();

	if (categorySlug && categorySlug !== "-" && categoryName) {
		items.push({
			"@type": "ListItem",
			position: 2,
			name: categoryName,
			item: absoluteUrl(`/categories/${categorySlug}`),
		});
		items.push({
			"@type": "ListItem",
			position: 3,
			name: title,
			item: absoluteUrl(`/${uid}`),
		});
	} else {
		items.push({
			"@type": "ListItem",
			position: 2,
			name: title,
			item: absoluteUrl(`/${uid}`),
		});
	}

	return {
		"@type": "BreadcrumbList",
		itemListElement: items,
	};
};

export const buildSketchStructuredData = ({
	uid,
	title,
	description,
	image,
	publishedAt,
	tags = [],
}) => {
	const validTags = resolveSketchTagDocs(tags);
	const primaryTagDoc = validTags[0];
	const primaryTag = primaryTagDoc
		? {
				slug: (primaryTagDoc.uid || primaryTagDoc.slug).trim(),
				name: tagLabelFromDoc(primaryTagDoc),
			}
		: null;

	return {
		"@context": "https://schema.org",
		"@graph": [
			buildSketchImageObject({
				uid,
				title,
				description,
				image,
				publishedAt,
			}),
			buildSketchCreativeWork({
				uid,
				title,
				description,
				publishedAt,
				tags,
			}),
			buildSketchBreadcrumbs({ uid, title, primaryTag }),
		],
	};
};

export const buildBookProductGraph = () => ({
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "Book",
			"@id": `${SITE_URL}/big-ideas-little-pictures#book`,
			name: "Big Ideas Little Pictures: Explaining the world one sketch at a time",
			url: `${SITE_URL}/big-ideas-little-pictures`,
			author: CREATOR,
			publisher: {
				"@type": "Organization",
				name: "Media Lab Books",
			},
			image: `${SITE_URL}/images/big-ideas-little-pictures-book-thumbnail-1200x630.png`,
			description:
				"A delightful book that simplifies complex ideas with clear illustrations. Over 130 inspiring, funny and relatable sketches about life.",
			isbn: "9781956403572",
			numberOfPages: 288,
			inLanguage: "en",
			bookFormat: "https://schema.org/Hardcover",
			aggregateRating: {
				"@type": "AggregateRating",
				ratingValue: "4.8",
				bestRating: "5",
				ratingCount: 228,
				reviewCount: 228,
			},
			review: {
				"@type": "Review",
				author: {
					"@type": "Person",
					name: "Bill Gates",
				},
				reviewBody:
					"This is such a cool book. The range of Jono's knowledge is astounding, and so is his ability to digest complex ideas into deceptively simple drawings. You'll learn something on every page—and be entertained too.",
			},
		},
		{
			"@type": "Product",
			"@id": `${SITE_URL}/big-ideas-little-pictures#product`,
			name: "Big Ideas Little Pictures",
			description:
				"A delightful book that simplifies complex ideas with clear illustrations. Over 130 inspiring, funny and relatable sketches about life.",
			image: `${SITE_URL}/images/big-ideas-little-pictures-book-thumbnail-1200x630.png`,
			sku: "9781956403572",
			gtin13: "9781956403572",
			brand: {
				"@type": "Brand",
				name: SITE_NAME,
			},
			isRelatedTo: { "@id": `${SITE_URL}/big-ideas-little-pictures#book` },
			offers: {
				"@type": "Offer",
				url: `${SITE_URL}/big-ideas-little-pictures`,
				availability: "https://schema.org/InStock",
				price: "18.99",
				priceCurrency: "USD",
			},
			aggregateRating: {
				"@type": "AggregateRating",
				ratingValue: "4.8",
				bestRating: "5",
				ratingCount: 228,
				reviewCount: 228,
			},
			review: {
				"@type": "Review",
				author: {
					"@type": "Person",
					name: "Bill Gates",
				},
				reviewBody:
					"This is such a cool book. The range of Jono's knowledge is astounding, and so is his ability to digest complex ideas into deceptively simple drawings. You'll learn something on every page—and be entertained too.",
			},
		},
	],
});
