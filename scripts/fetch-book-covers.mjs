import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

import dotenv from "dotenv";

import { normalizeBookTitle, normalizeParsedTitle } from "../utils/bookLinks.mjs";

dotenv.config({ path: path.join(process.cwd(), ".env") });
dotenv.config({ path: path.join(process.cwd(), ".env.local"), override: true });

const BOOKS_INDEX_PATH = path.join(process.cwd(), "data/books-index.json");
const COVERS_PATH = path.join(process.cwd(), "data/books-covers.json");
const OVERRIDES_PATH = path.join(process.cwd(), "data/books-overrides.json");
const COVERS_DIR = path.join(process.cwd(), "public/books");

const USER_AGENT =
	"SketchplanationsBooksBot/1.0 (cover lookup; jonohey@sketchplanations.com)";

/** Delay between books — keep polite; Google needs longer gaps. */
const DEFAULT_DELAY_MS = 800;

/** Prefer replacing Open Library scans when Google returns a larger file. */
const MIN_UPGRADE_BYTES = 45_000;

function loadJson(filePath, fallback) {
	try {
		return JSON.parse(fs.readFileSync(filePath, "utf8"));
	} catch {
		return fallback;
	}
}

function parseArgs(argv) {
	const force = argv.includes("--force");
	const retryMissing = argv.includes("--retry-missing");
	const upgrade = argv.includes("--upgrade");
	const limitArg = argv.find((arg) => arg.startsWith("--limit="));
	const delayArg = argv.find((arg) => arg.startsWith("--delay="));
	const onlyArg = argv.find((arg) => arg.startsWith("--only="));

	return {
		force,
		retryMissing,
		upgrade,
		limit: limitArg ? Number.parseInt(limitArg.split("=")[1], 10) : null,
		delayMs: delayArg
			? Number.parseInt(delayArg.split("=")[1], 10)
			: DEFAULT_DELAY_MS,
		only: onlyArg
			? onlyArg
					.slice("--only=".length)
					.split("|")
					.map((s) => s.trim().toLowerCase())
					.filter(Boolean)
			: null,
	};
}

function coverSlug(titleKey) {
	return titleKey
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function lookupTitle(title) {
	return normalizeParsedTitle(
		title
			.replace(/^audiobook of\s+/i, "")
			.replace(/\s+book$/i, "")
			.trim(),
	);
}

async function resolveProductId(url) {
	const response = await fetch(url, {
		redirect: "follow",
		headers: { "User-Agent": USER_AGENT },
	});

	const finalUrl = response.url;
	const patterns = [
		/\/dp\/([A-Z0-9]{10})/i,
		/\/gp\/product\/([A-Z0-9]{10})/i,
		/\/d\/([A-Z0-9]{10})/i,
	];

	for (const pattern of patterns) {
		const match = finalUrl.match(pattern);
		if (match) return match[1];
	}

	return null;
}

/** Google Books sometimes returns a fixed "image not available" PNG. */
const GOOGLE_PLACEHOLDER_MD5 = new Set([
	"a64fa89d7ebc97075c1d363fc5fea71f",
	"1fe98bd081e1f98c8193d52c74cf2ad2",
]);

/**
 * @param {string} coverUrl
 * @param {string} source
 * @param {string | null} isbn
 */
async function downloadCoverImage(coverUrl, source, isbn = null) {
	const response = await fetch(coverUrl, {
		headers: { "User-Agent": USER_AGENT },
		redirect: "follow",
	});

	if (!response.ok) return null;

	const buffer = Buffer.from(await response.arrayBuffer());
	if (buffer.length < 12_000) return null;

	const hash = createHash("md5").update(buffer).digest("hex");
	if (GOOGLE_PLACEHOLDER_MD5.has(hash)) return null;

	const contentType = response.headers.get("content-type") ?? "image/jpeg";
	if (!contentType.startsWith("image/")) return null;

	// Greyscale PNG placeholders are ~9KB; real covers are usually JPEG
	if (contentType.includes("png") && buffer.length < 25_000) return null;

	// Tiny Google thumbs are often ~128px / <18KB — prefer larger zoom or Open Library
	if (source === "google" && buffer.length < 18_000) return null;

	return { buffer, contentType, source, isbn };
}

async function fetchOpenLibraryCoverByIsbn(isbn, expectedTitle) {
	if (expectedTitle) {
		try {
			const metaResponse = await fetch(
				`https://openlibrary.org/isbn/${isbn}.json`,
				{ headers: { "User-Agent": USER_AGENT } },
			);
			if (metaResponse.ok) {
				const edition = await metaResponse.json();
				const editionTitle = (edition.title ?? "").toLowerCase();
				const expected = lookupTitle(expectedTitle).toLowerCase();
				const titleMatch =
					!editionTitle ||
					editionTitle === expected ||
					editionTitle.startsWith(expected.slice(0, 12)) ||
					expected.startsWith(editionTitle.slice(0, 12));
				if (!titleMatch) return null;
			}
		} catch {
			// If metadata check fails, still try the cover image.
		}
	}

	return downloadCoverImage(
		`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`,
		"openlibrary",
		isbn,
	);
}

async function fetchOpenLibraryCoverByTitle(title, author) {
	const params = new URLSearchParams({
		title: lookupTitle(title),
		limit: "8",
	});
	if (author) params.set("author", author.split(",")[0].trim());

	const response = await fetch(`https://openlibrary.org/search.json?${params}`, {
		headers: { "User-Agent": USER_AGENT },
	});

	if (!response.ok) return null;

	const data = await response.json();
	const normalizedTitle = lookupTitle(title).toLowerCase();

	for (const doc of data.docs ?? []) {
		if (!doc.cover_i || !doc.title) continue;

		const docTitle = doc.title.toLowerCase();
		const titleMatch =
			docTitle === normalizedTitle ||
			docTitle.startsWith(normalizedTitle.slice(0, 12)) ||
			normalizedTitle.startsWith(docTitle.slice(0, 12));
		if (!titleMatch) continue;

		// Avoid near-misses like "Art of Statistics" for "Art of Uncertainty"
		const expectedTokens = normalizedTitle.split(/\s+/).filter((t) => t.length > 3);
		const matchedTokens = expectedTokens.filter((t) => docTitle.includes(t));
		if (
			expectedTokens.length >= 2 &&
			matchedTokens.length < Math.ceil(expectedTokens.length * 0.6)
		) {
			continue;
		}

		const isbn = doc.isbn?.[0] ?? null;
		const cover = await downloadCoverImage(
			`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg?default=false`,
			"openlibrary-search",
			isbn,
		);
		if (cover) return cover;
	}

	return null;
}

function pickGoogleCoverUrls(imageLinks) {
	if (!imageLinks) return [];

	const preferred =
		imageLinks.extraLarge ??
		imageLinks.large ??
		imageLinks.medium ??
		imageLinks.small ??
		imageLinks.thumbnail ??
		imageLinks.smallThumbnail;

	if (!preferred) return [];

	const httpsUrl = preferred
		.replace(/^http:\/\//, "https://")
		.replace(/&edge=curl/, "");

	// Prefer zoom=2; zoom=1 is often tiny (~128px), zoom=3 often "image not available"
	const urls = [];
	for (const zoom of [2, 1, 3]) {
		if (/zoom=\d/.test(httpsUrl)) {
			urls.push(httpsUrl.replace(/zoom=\d/, `zoom=${zoom}`));
		} else {
			urls.push(`${httpsUrl}${httpsUrl.includes("?") ? "&" : "?"}zoom=${zoom}`);
		}
	}
	return [...new Set(urls)];
}

async function fetchGoogleBooksCover({ isbn, title, author }) {
	const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
	const queries = [];
	if (isbn) queries.push(`isbn:${isbn}`);
	if (title) {
		const base = lookupTitle(title);
		if (author) {
			queries.push(`intitle:${base} inauthor:${author.split(",")[0].trim()}`);
		}
		queries.push(base);
	}

	for (const q of queries) {
		const params = new URLSearchParams({
			q,
			maxResults: "8",
			printType: "books",
			langRestrict: "en",
		});
		if (apiKey) params.set("key", apiKey);

		const response = await fetch(
			`https://www.googleapis.com/books/v1/volumes?${params}`,
			{ headers: { "User-Agent": USER_AGENT } },
		);

		if (response.status === 429) {
			console.log(
				"  (Google Books rate-limited — falling back / try later)",
			);
			return null;
		}

		if (response.status === 503) {
			console.log("  (Google Books temporarily unavailable — retrying once)");
			await sleep(2000);
			const retry = await fetch(
				`https://www.googleapis.com/books/v1/volumes?${params}`,
				{ headers: { "User-Agent": USER_AGENT } },
			);
			if (!retry.ok) continue;
			const retryData = await retry.json();
			const downloaded = await pickCoverFromGoogleItems(
				retryData.items ?? [],
				{ isbn, title, author, apiKey },
			);
			if (downloaded) return downloaded;
			continue;
		}

		if (!response.ok) continue;

		const data = await response.json();
		const downloaded = await pickCoverFromGoogleItems(data.items ?? [], {
			isbn,
			title,
			author,
			apiKey,
		});
		if (downloaded) return downloaded;
	}

	return null;
}

async function pickCoverFromGoogleItems(items, { isbn, title, author, apiKey }) {
	for (const item of items) {
		const language = item.volumeInfo?.language;
		if (language && language !== "en") continue;

		const itemTitle = (item.volumeInfo?.title ?? "").toLowerCase();
		const expected = lookupTitle(title ?? "").toLowerCase();
		if (
			expected &&
			itemTitle &&
			!itemTitle.includes(expected.slice(0, 12)) &&
			!expected.includes(itemTitle.slice(0, 12))
		) {
			continue;
		}

		// Skip obvious translation editions when title contains non-latin script
		if (/[^\u0000-\u024f]/.test(item.volumeInfo?.title ?? "")) continue;

		let imageLinks = item.volumeInfo?.imageLinks;

		if (item.id && (!imageLinks?.medium || !imageLinks?.large)) {
			const detailParams = new URLSearchParams();
			if (apiKey) detailParams.set("key", apiKey);
			const detailUrl = `https://www.googleapis.com/books/v1/volumes/${item.id}${
				detailParams.size ? `?${detailParams}` : ""
			}`;
			const detail = await fetch(detailUrl, {
				headers: { "User-Agent": USER_AGENT },
			});
			if (detail.ok) {
				const detailJson = await detail.json();
				imageLinks = detailJson.volumeInfo?.imageLinks ?? imageLinks;
			}
		}

		const coverUrls = pickGoogleCoverUrls(imageLinks);
		for (const coverUrl of coverUrls) {
			const downloaded = await downloadCoverImage(
				coverUrl,
				"google",
				isbn ??
					item.volumeInfo?.industryIdentifiers?.find((id) =>
						id.type?.includes("ISBN"),
					)?.identifier ??
					null,
			);
			if (downloaded) return downloaded;
		}
	}

	return null;
}

function extensionForContentType(contentType) {
	if (contentType.includes("png")) return "png";
	if (contentType.includes("webp")) return "webp";
	if (contentType.includes("gif")) return "gif";
	return "jpg";
}

/**
 * Prefer Google (sharper publisher covers) then Open Library.
 */
async function fetchCoverForBook(book) {
	const productId = await resolveProductId(book.url);

	const google = await fetchGoogleBooksCover({
		isbn: productId,
		title: book.title,
		author: book.author,
	});
	if (google) return google;

	if (productId) {
		const byIsbn = await fetchOpenLibraryCoverByIsbn(productId, book.title);
		if (byIsbn) return byIsbn;
	}

	return fetchOpenLibraryCoverByTitle(book.title, book.author);
}

function shouldUpgradeExisting(existing, absolutePath) {
	if (!existing?.path || !fs.existsSync(absolutePath)) return true;
	if (existing.source === "google") {
		const size = fs.statSync(absolutePath).size;
		return size < MIN_UPGRADE_BYTES;
	}
	// Open Library covers are often soft scans — try Google upgrade
	return true;
}

async function fetchBookCovers({
	force = false,
	retryMissing = false,
	upgrade = false,
	limit = null,
	delayMs = DEFAULT_DELAY_MS,
	only = null,
} = {}) {
	const index = loadJson(BOOKS_INDEX_PATH, { books: [] });
	const overrides = loadJson(OVERRIDES_PATH, { books: {} }).books ?? {};
	const covers = loadJson(COVERS_PATH, { covers: {} }).covers ?? {};

	fs.mkdirSync(COVERS_DIR, { recursive: true });

	const candidates = index.books.filter((book) => {
		const key = normalizeBookTitle(book.title);
		if (overrides[key]?.thumbnail) return false;

		if (only) {
			const haystack = `${book.title} ${book.author ?? ""}`.toLowerCase();
			if (!only.some((needle) => haystack.includes(needle))) return false;
		}

		const existing = covers[key];
		const absolute = existing?.path
			? path.join(process.cwd(), "public", existing.path)
			: null;

		if (force || (upgrade && only)) {
			return true;
		}

		if (upgrade && existing?.path && absolute) {
			return shouldUpgradeExisting(existing, absolute);
		}

		if (!force && existing?.path && absolute && fs.existsSync(absolute)) {
			return false;
		}

		// Skip known misses unless retrying/forcing
		if (!force && !retryMissing && existing && !existing.path) return false;

		return true;
	});

	const batch = limit == null ? candidates : candidates.slice(0, limit);

	console.log(
		`[fetchBookCovers] ${candidates.length} candidates; processing ${batch.length}${limit != null ? ` (limit ${limit})` : ""}${upgrade ? " [upgrade]" : ""}${only ? ` [only: ${only.join("|")}]` : ""}...`,
	);

	let found = 0;
	let failed = 0;
	let skippedSmaller = 0;

	for (const book of batch) {
		const key = normalizeBookTitle(book.title);
		const slug = coverSlug(key);
		const existing = covers[key];
		const existingAbsolute = existing?.path
			? path.join(process.cwd(), "public", existing.path)
			: null;
		const existingSize =
			existingAbsolute && fs.existsSync(existingAbsolute)
				? fs.statSync(existingAbsolute).size
				: 0;

		try {
			const result = await fetchCoverForBook(book);

			if (!result) {
				failed += 1;
				if (!existing?.path) {
					covers[key] = {
						path: null,
						isbn: null,
						source: null,
						status: "missing",
					};
				}
				console.log(`✗ ${book.title}`);
			} else {
				// Keep a larger existing cover unless --force (avoids replacing OL with tiny Google thumbs)
				if (
					!force &&
					existingSize > 0 &&
					result.buffer.length < existingSize * 0.9
				) {
					skippedSmaller += 1;
					console.log(
						`~ ${book.title} kept existing (${existingSize}b > new ${result.buffer.length}b)`,
					);
				} else {
					const ext = extensionForContentType(result.contentType);
					const relativePath = `/books/${slug}.${ext}`;
					const absolutePath = path.join(COVERS_DIR, `${slug}.${ext}`);

					// Remove previous file if extension/slug changed
					if (
						existingAbsolute &&
						fs.existsSync(existingAbsolute) &&
						existingAbsolute !== absolutePath
					) {
						fs.unlinkSync(existingAbsolute);
					}

					fs.writeFileSync(absolutePath, result.buffer);

					covers[key] = {
						path: relativePath,
						isbn: result.isbn ?? null,
						source: result.source,
					};

					found += 1;
					console.log(
						`✓ ${book.title} → ${relativePath} (${result.source}${result.isbn ? `, ${result.isbn}` : ""}, ${result.buffer.length}b)`,
					);
				}
			}
		} catch (error) {
			failed += 1;
			if (!existing?.path) {
				covers[key] = {
					path: null,
					isbn: null,
					source: null,
					status: "missing",
					error: error.message,
				};
			}
			console.log(`✗ ${book.title} (${error.message})`);
		}

		await sleep(delayMs);
	}

	const sortedCovers = Object.fromEntries(
		Object.entries(covers).sort(([a], [b]) => a.localeCompare(b)),
	);

	fs.writeFileSync(
		COVERS_PATH,
		`${JSON.stringify({ covers: sortedCovers }, null, "\t")}\n`,
	);

	const withPath = Object.values(sortedCovers).filter((c) => c.path).length;
	const remaining = Math.max(0, candidates.length - batch.length);
	console.log(
		`[fetchBookCovers] Done. Updated ${found}, failed ${failed}${skippedSmaller ? `, kept ${skippedSmaller}` : ""}. ${withPath} covers on disk.${remaining > 0 ? ` Re-run with --limit=${limit ?? 25} for the next batch.` : ""}`,
	);
}

const options = parseArgs(process.argv.slice(2));

fetchBookCovers(options).catch((error) => {
	console.error("[fetchBookCovers] Failed:", error);
	process.exit(1);
});
