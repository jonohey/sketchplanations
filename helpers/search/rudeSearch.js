import { normalizeForSearch } from "./normalize.js";

// Curated from search analytics (May–Jun 2026) plus common variants.
// Excludes ambiguous terms (e.g. "bs") and legitimate sketch topics (e.g. "sex").
const RUDE_SEARCH_TERMS = new Set([
	"arse",
	"ass",
	"balls",
	"bastard",
	"boob",
	"boobs",
	"bollocks",
	"bum",
	"butt",
	"dick",
	"fart",
	"farting",
	"fuck",
	"fucker",
	"fucking",
	"nasty",
	"pee",
	"peeing",
	"penis",
	"poo",
	"poop",
	"pussy",
	"rude",
	"shit",
	"testicle",
	"testicles",
	"tits",
	"wank",
	"wanker",
	"wanking",
]);

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const rudeTermPattern = new RegExp(
	`\\b(?:${[...RUDE_SEARCH_TERMS].map(escapeRegExp).join("|")})\\b`,
);

export const isRudeSearch = (query) => {
	const normalized = normalizeForSearch(query);
	if (!normalized) return false;

	if (RUDE_SEARCH_TERMS.has(normalized)) return true;

	return rudeTermPattern.test(normalized);
};

export const shouldShowStretchMissMessage = (
	isStretchMatch,
	showRudeSearchEasterEgg,
) => isStretchMatch && !showRudeSearchEasterEgg;

export const shouldShowSuggestMissingSketch = (showRudeSearchEasterEgg) =>
	!showRudeSearchEasterEgg;
