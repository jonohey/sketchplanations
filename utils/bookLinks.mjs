/**
 * Extract and normalise book affiliate links from Prismic sketchplanation bodies.
 */

export const BOOK_URL_PATTERN =
	/^(https?:\/\/)?(geni\.us\/|amzn\.to\/|a\.co\/|(www\.)?amazon\.)/i;

/** URLs that are books but shouldn't appear on the reading list. */
export const EXCLUDED_BOOK_URLS = new Set([
	"https://geni.us/big-ideas-book",
	"http://geni.us/big-ideas-book",
]);

/**
 * @param {string} url
 */
export function isBookAffiliateUrl(url) {
	if (!url || typeof url !== "string") return false;
	return BOOK_URL_PATTERN.test(url.trim());
}

/**
 * @param {string} url
 */
export function normalizeBookUrl(url) {
	try {
		const parsed = new URL(url.trim());
		parsed.protocol = "https:";
		parsed.hash = "";
		let path = parsed.pathname.replace(/\/$/, "");
		return `${parsed.origin}${path}`.toLowerCase();
	} catch {
		return url.trim().toLowerCase().replace(/\/$/, "");
	}
}

/**
 * @param {string} url
 */
export function bookUrlScore(url) {
	if (/geni\.us/i.test(url)) return 3;
	if (/amzn\.to|a\.co/i.test(url)) return 2;
	if (/amazon\./i.test(url)) return 1;
	return 0;
}

/**
 * @param {string} author
 */
export function cleanAuthorName(author) {
	return author.replace(/,?\s*\d{4}\s*$/, "").trim();
}

/**
 * @param {string} text
 */
export function cleanLinkText(text) {
	return text
		.replace(/^see\s+/i, "")
		.replace(/^read\s+/i, "")
		.replace(
			/^(?:audiobook|audio book|kindle edition|ebook)\s+of\s+/i,
			"",
		)
		.replace(/\s+book$/i, "")
		.replace(/[.,;:]+$/, "")
		.trim();
}

/**
 * @param {string} title
 */
export function normalizeParsedTitle(title) {
	return title
		.replace(
			/^(?:audiobook|audio book|kindle edition|ebook)\s+of\s+/i,
			"",
		)
		.replace(/^(?:her|his|their|my)\s+book\s+/i, "")
		.trim();
}

/** Matches straight and curly apostrophes in possessive names. */
const POSSESSIVE_APOSTROPHE = "['\u2019]";

/**
 * @param {string} text
 * @returns {{ title: string, author?: string }}
 */
export function parseBookLinkText(text) {
	const cleaned = cleanLinkText(text);

	const byMatch = cleaned.match(/^(.+?)\s+by\s+(.+)$/i);
	if (byMatch) {
		return {
			title: normalizeParsedTitle(byMatch[1].replace(/,\s*$/, "").trim()),
			author: cleanAuthorName(byMatch[2].trim()),
		};
	}

	const commaByMatch = cleaned.match(/^(.+?),\s*by\s+(.+)$/i);
	if (commaByMatch) {
		return {
			title: normalizeParsedTitle(commaByMatch[1].trim()),
			author: cleanAuthorName(commaByMatch[2].trim()),
		};
	}

	const possessiveMatch = cleaned.match(
		new RegExp(
			`^(.+?)${POSSESSIVE_APOSTROPHE}s\\s+(?:excellent\\s+)?book(?:\\s+(.+))?$`,
			"i",
		),
	);
	if (possessiveMatch) {
		if (possessiveMatch[2]) {
			return {
				title: normalizeParsedTitle(possessiveMatch[2].trim()),
				author: possessiveMatch[1].trim(),
			};
		}
	}

	const possessiveTitleMatch = cleaned.match(
		new RegExp(`^(.+?)${POSSESSIVE_APOSTROPHE}s,?\\s+(?!book\\b)(.+)$`, "i"),
	);
	if (possessiveTitleMatch) {
		const maybeAuthor = possessiveTitleMatch[1].trim();
		const maybeTitle = normalizeParsedTitle(possessiveTitleMatch[2].trim());
		const authorWords = maybeAuthor.split(/\s+/).filter(Boolean);
		const lastAuthorWord = authorWords[authorWords.length - 1] ?? "";
		// Skip contractions ("Why It's Broken…") and title-internal possessives
		// ("Einstein's Mirror", "A History of Murphy's Law").
		const isContraction = /^(?:it|what|that|let|here|who|there|she|he)$/i.test(
			lastAuthorWord,
		);
		const looksLikeTitlePossessive =
			authorWords.length === 1 && maybeTitle.split(/\s+/).length <= 2;
		const authorLooksLikeTitle =
			/^(?:the|a|an)\b/i.test(maybeAuthor) ||
			/\b(?:history|story|art|science|diary|adventures)\b/i.test(maybeAuthor);

		if (
			!maybeAuthor.includes(":") &&
			!isContraction &&
			!looksLikeTitlePossessive &&
			!authorLooksLikeTitle
		) {
			return {
				title: maybeTitle,
				author: maybeAuthor,
			};
		}
	}

	const pronounBookMatch = cleaned.match(
		/^(?:her|his|their|my)\s+book\s+(.+)$/i,
	);
	if (pronounBookMatch) {
		return {
			title: normalizeParsedTitle(pronounBookMatch[1].trim()),
		};
	}

	const parsedTitle = normalizeParsedTitle(cleaned);
	return parsedTitle ? { title: parsedTitle } : { title: cleaned };
}

/**
 * @param {string} title
 */
export function normalizeBookTitle(title) {
	const withoutTrailingAuthor = title.replace(
		/,\s+[A-Z][^.]*?(?:\s+[A-Z][^.]*?){0,2}$/,
		"",
	);

	const colonMatch = withoutTrailingAuthor.match(/^(.+?):\s*.+$/);
	const mainTitle =
		colonMatch &&
		colonMatch[1].replace(/[^\w\s]/g, "").trim().length >= 15
			? colonMatch[1]
			: withoutTrailingAuthor;

	return normalizeParsedTitle(mainTitle)
		.toLowerCase()
		.replace(/\s+book$/i, "")
		.replace(/[^\w\s]/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Walk Prismic rich text blocks and extract hyperlink spans.
 * @param {import('@prismicio/types').RichTextField} body
 * @returns {{ url: string, text: string }[]}
 */
export function extractBookLinksFromBody(body) {
	const links = [];

	for (const block of body ?? []) {
		if (!block.spans?.length || !block.text) continue;

		for (const span of block.spans) {
			if (span.type !== "hyperlink" || !span.data?.url) continue;
			if (!isBookAffiliateUrl(span.data.url)) continue;
			if (EXCLUDED_BOOK_URLS.has(span.data.url.trim())) continue;

			links.push({
				url: span.data.url.trim(),
				text: block.text.slice(span.start, span.end).trim(),
			});
		}
	}

	return links;
}

/**
 * @param {object[]} linkInstances
 * @param {Record<string, object>} [overridesByTitle]
 * @returns {object[]}
 */
export function buildBooksIndex(linkInstances, overridesByTitle = {}) {
	/** @type {Map<string, object>} */
	const booksByTitle = new Map();

	for (const instance of linkInstances) {
		const parsed = parseBookLinkText(instance.text);
		const lookupKey = normalizeBookTitle(parsed.title);

		if (!lookupKey) continue;

		const override =
			overridesByTitle[lookupKey] ?? overridesByTitle[parsed.title];
		if (override?.exclude) continue;

		const titleKey = override?.title
			? normalizeBookTitle(override.title)
			: lookupKey;

		let book = booksByTitle.get(titleKey);

		if (!book) {
			book = {
				title: override?.title ?? parsed.title,
				author: override?.author ?? parsed.author ?? null,
				url: instance.url,
				note: override?.note ?? null,
				thumbnail: override?.thumbnail ?? null,
				sketches: [],
			};
			booksByTitle.set(titleKey, book);
		}

		if (
			!book.author &&
			parsed.author &&
			parsed.author.length > book.title.length / 2
		) {
			book.author = parsed.author;
		}

		if (bookUrlScore(instance.url) > bookUrlScore(book.url)) {
			book.url = instance.url;
		}

		if (override?.url) book.url = override.url;
		if (override?.title) book.title = override.title;
		if (override?.author) book.author = override.author;
		if (override?.note) book.note = override.note;
		if (override?.thumbnail) book.thumbnail = override.thumbnail;

		if (!book.sketches.some((s) => s.uid === instance.uid)) {
			book.sketches.push({
				uid: instance.uid,
				title: instance.sketchTitle,
			});
		}
	}

	return [...booksByTitle.values()].sort((a, b) => {
		const sketchDiff = b.sketches.length - a.sketches.length;
		if (sketchDiff !== 0) return sketchDiff;

		return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
	});
}

/**
 * @param {string} a
 * @param {string} b
 * @param {number} wordCount
 */
function shareWordPrefix(a, b, wordCount) {
	const aWords = a.split(" ");
	const bWords = b.split(" ");
	if (aWords.length < wordCount || bWords.length < wordCount) return false;

	for (let i = 0; i < wordCount; i++) {
		if (aWords[i] !== bWords[i]) return false;
	}

	return true;
}

/**
 * Flag likely duplicate books that should be merged via overrides or parsing.
 * @param {object[]} books
 * @returns {{ a: object, b: object, reason: string }[]}
 */
export function findPotentialDuplicateBooks(books) {
	/** @type {{ a: object, b: object, reason: string }[]} */
	const duplicates = [];

	for (let i = 0; i < books.length; i++) {
		for (let j = i + 1; j < books.length; j++) {
			const bookA = books[i];
			const bookB = books[j];
			const keyA = normalizeBookTitle(bookA.title);
			const keyB = normalizeBookTitle(bookB.title);

			if (keyA === keyB) continue;

			const minLen = Math.min(keyA.length, keyB.length);
			if (minLen < 10) continue;

			const isPrefix =
				(keyA.length < keyB.length && keyB.startsWith(`${keyA} `)) ||
				(keyB.length < keyA.length && keyA.startsWith(`${keyB} `));

			const sameAuthor =
				bookA.author &&
				bookB.author &&
				bookA.author.toLowerCase() === bookB.author.toLowerCase();

			if (isPrefix) {
				duplicates.push({
					a: bookA,
					b: bookB,
					reason: "one title is a prefix of the other",
				});
				continue;
			}

			if (sameAuthor && shareWordPrefix(keyA, keyB, 4)) {
				duplicates.push({
					a: bookA,
					b: bookB,
					reason: "same author and very similar titles",
				});
			}
		}
	}

	return duplicates;
}

/**
 * @param {import('@prismicio/client').Client} client
 * @param {Record<string, object>} [overridesByTitle]
 */
export async function fetchBooksFromPrismic(client, overridesByTitle = {}) {
	const sketchplanations = await client.getAllByType("sketchplanation", {
		fetch: [
			"sketchplanation.title",
			"sketchplanation.body",
			"sketchplanation.uid",
		],
	});

	const linkInstances = [];

	for (const sketch of sketchplanations) {
		const links = extractBookLinksFromBody(sketch.data.body);

		for (const link of links) {
			linkInstances.push({
				...link,
				uid: sketch.uid,
				sketchTitle: sketch.data.title,
			});
		}
	}

	return buildBooksIndex(linkInstances, overridesByTitle);
}
