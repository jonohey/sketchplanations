const paragraph = (text, spans = []) => ({
	type: "paragraph",
	text,
	spans,
});

const psychologyTagRef = { tag: { id: "tag-psychology" } };
const scienceTagRef = { tag: { id: "tag-science" } };

export const buildCatalogTags = [
	{
		id: "tag-science",
		uid: "science",
		slugs: ["science"],
		last_publication_date: "2024-06-02T00:00:00+0000",
		data: { identifier: "science" },
	},
	{
		id: "tag-psychology",
		uid: "psychology",
		slugs: ["psychology"],
		last_publication_date: "2024-01-15T00:00:00+0000",
		data: { identifier: "psychology" },
	},
];

export const buildCatalogSketches = [
	{
		id: "sketch-oldest",
		uid: "oldest-sketch",
		last_publication_date: "2020-01-01T00:00:00+0000",
		data: {
			title: "Oldest Sketch",
			published_at: "2018-01-01",
			image: { url: "https://images.example.com/oldest.png?foo=1&bar=2", alt: "Oldest" },
			tags: [psychologyTagRef],
			body: [paragraph("An old idea about habits.")],
		},
	},
	{
		id: "sketch-middle",
		uid: "middle-sketch",
		last_publication_date: "2024-12-01T00:00:00+0000",
		data: {
			title: "Middle Sketch",
			published_at: "2022-06-15",
			image: { url: "https://images.example.com/middle.png", alt: "Middle" },
			tags: [scienceTagRef, psychologyTagRef],
			body: [
				paragraph("See Factfulness by Hans Rosling", [
					{
						type: "hyperlink",
						start: 4,
						end: 32,
						data: { url: "https://geni.us/factfulness" },
					},
				]),
			],
		},
	},
	{
		id: "sketch-edited-recently",
		uid: "edited-recently",
		last_publication_date: "2025-09-01T00:00:00+0000",
		data: {
			title: "Edited Recently",
			published_at: "2021-03-01",
			image: { url: "https://images.example.com/edited.png", alt: "" },
			tags: [],
			body: [paragraph("CMS edit is newer than the original publish date.")],
		},
	},
	{
		id: "sketch-newest",
		uid: "newest-sketch",
		last_publication_date: "2025-01-01T00:00:00+0000",
		data: {
			title: "Newest Sketch",
			published_at: "2025-08-01",
			image: { url: "https://images.example.com/newest.png", alt: "Newest" },
			tags: [scienceTagRef],
			body: [paragraph("A brand new explanation.")],
		},
	},
];

export const buildCatalog = {
	sketchplanations: buildCatalogSketches,
	tags: buildCatalogTags,
};
