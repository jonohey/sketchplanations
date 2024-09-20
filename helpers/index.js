import * as prismic from "@prismicio/client";
import humanizeString from "humanize-string";
import { complement, either, isEmpty, isNil } from "ramda";

import { client } from "services/prismic";

const defaultPageTitle = "Sketchplanations - A weekly explanation in a sketch";

const fulltextDocumentSearch = async (documentType, query) => {
	if (!query || query === "") return [];

	const { results } = await client.get({
		filters: [
			prismic.filter.at("document.type", documentType),
			prismic.filter.fulltext("document", query),
		],
		pageSize: 100,
	});

	return results;
};

export const searchSketchplanations = async (query, { limit = 100 } = {}) => {
	if (!query || query === "") return [];

	const { results: titleResults } = await client.get({
		filters: [
			prismic.filter.at("document.type", "sketchplanation"),
			prismic.filter.fulltext("my.sketchplanation.title", query),
		],
		pageSize: limit,
	});

	const documentResults = await fulltextDocumentSearch(
		"sketchplanation",
		query,
	);

	// Combine the results and remove duplicates
	const results = [...titleResults, ...documentResults].reduce(
		(acc, result) => {
			const existingResult = acc.find((r) => r.id === result.id);

			if (!existingResult) {
				acc.push(result);
			}

			return acc;
		},
		[],
	);

	return results;
};

export const searchTags = async (query) =>
	await fulltextDocumentSearch("tag", query);

export const pageTitle = (title) => {
	if (!title) return defaultPageTitle;

	return `${title} - Sketchplanations`;
};

export const isBlank = either(isEmpty, isNil);

export const isPresent = complement(isBlank);

export const setCookie = (name, value, days) => {
	let expires = "";

	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		expires = `; expires=${date.toGMTString()}`;
	}

	document.cookie = `${name}=${value}${expires}; path=/`;
};

export const getCookie = (name) => {
	const nameEQ = `${name}=`;
	const ca = document.cookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === " ") c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
};

const contractions = [
	"whats",
	"thats",
	"hows",
	"whos",
	"its",
	"theyre",
	"youre",
	"wouldnt",
	"couldnt",
	"shouldnt",
	"cant",
	"dont",
	"wont",
	"hasnt",
	"havent",
	"hadnt",
	"isnt",
	"arent",
	"wasnt",
	"werent",
	"didnt",
];

const capitalizedWords = ["ai"];

const addApostrophes = (str) => {
	return str
		.split(" ")
		.map((word) => {
			if (capitalizedWords.includes(word.toLowerCase())) {
				return word.toUpperCase();
			}
			return contractions.includes(word.toLowerCase())
				? `${word.slice(0, -1)}'${word.slice(-1)}`
				: word;
		})
		.join(" ");
};

export const humanizeTag = (tag) => addApostrophes(humanizeString(tag));

export const humanizePublishedDate = (publishedAt, { showYear = false } = {}) => {
	const publishedDate = new Date(publishedAt);
	const currentDate = new Date();

	if (publishedDate > currentDate) return "✨ Latest";

	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const day = publishedDate.getDate();
	const month = months[publishedDate.getMonth()];
	const year = publishedDate.getFullYear();

	return showYear || currentDate.getFullYear() !== year
		? `${day} ${month} ${year}`
		: `${day} ${month}`;
};

// Fisher-Yates shuffle algorithm
export const shuffle = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};
