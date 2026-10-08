// Arranges reader quotes into two-quote columns. Long quotes are paired with
// short ones so columns come out a similar height. The row opens centred on
// the first column, which leads with a `lead` quote; featured columns are
// split between the start and the end so they sit either side of it.

const shuffle = (items, random) => {
	const result = [...items];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
};

// Fixed seed so the server render and first client render match.
export const seededRandom = (seed) => () => {
	seed = (seed * 16807) % 2147483647;
	return (seed - 1) / 2147483646;
};

const pairByLength = (quotes) => {
	const sorted = [...quotes].sort((a, b) => b.quote.length - a.quote.length);
	const columns = [];
	for (let i = 0, j = sorted.length - 1; i <= j; i++, j--) {
		columns.push(i === j ? [sorted[i]] : [sorted[i], sorted[j]]);
	}
	return columns;
};

// The first column is the one centred on load: a random `lead` quote on top,
// with the partner whose length best evens it up with the other columns.
const leadColumn = (quotes, random) => {
	const leads = quotes.filter((quote) => quote.lead);
	if (leads.length === 0) return { column: null, rest: quotes };
	const lead = leads[Math.floor(random() * leads.length)];
	const others = quotes.filter((quote) => quote !== lead && !quote.lead);
	const averageColumn =
		(2 * quotes.reduce((sum, quote) => sum + quote.quote.length, 0)) /
		quotes.length;
	const target = averageColumn - lead.quote.length;
	const partner = others.reduce((best, quote) =>
		Math.abs(quote.quote.length - target) < Math.abs(best.quote.length - target)
			? quote
			: best,
	);
	return {
		column: [lead, partner],
		rest: quotes.filter((quote) => quote !== lead && quote !== partner),
	};
};

export const arrangeReaderQuotes = (quotes, random = Math.random) => {
	const { column: first, rest } = leadColumn(quotes, random);
	const columns = pairByLength(shuffle(rest, random)).map((column) =>
		column.length === 2 && (column[1].featured || random() < 0.5)
			? [column[1], column[0]]
			: column,
	);
	const featured = shuffle(
		columns.filter((column) => column.some((quote) => quote.featured)),
		random,
	);
	const regular = shuffle(
		columns.filter((column) => !column.some((quote) => quote.featured)),
		random,
	);
	const half = Math.ceil(featured.length / 2);
	return [
		...(first ? [first] : []),
		...featured.slice(0, half),
		...regular,
		...featured.slice(half),
	];
};
