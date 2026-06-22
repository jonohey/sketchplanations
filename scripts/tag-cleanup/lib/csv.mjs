/** Minimal CSV read/write for merge plans and audit exports. */

export const escapeCsvCell = (value) => {
	const text = value == null ? "" : String(value);
	if (/[",\n\r]/.test(text)) {
		return `"${text.replace(/"/g, '""')}"`;
	}
	return text;
};

export const rowToCsv = (cells) => cells.map(escapeCsvCell).join(",");

export const parseCsvLine = (line) => {
	const cells = [];
	let current = "";
	let inQuotes = false;

	for (let i = 0; i < line.length; i++) {
		const char = line[i];
		if (inQuotes) {
			if (char === '"') {
				if (line[i + 1] === '"') {
					current += '"';
					i++;
				} else {
					inQuotes = false;
				}
			} else {
				current += char;
			}
		} else if (char === '"') {
			inQuotes = true;
		} else if (char === ",") {
			cells.push(current);
			current = "";
		} else {
			current += char;
		}
	}
	cells.push(current);
	return cells;
};

export const parseCsv = (content) => {
	const lines = content.trim().split(/\r?\n/).filter(Boolean);
	if (lines.length === 0) return { headers: [], rows: [] };

	const headers = parseCsvLine(lines[0]);
	const rows = lines.slice(1).map((line) => {
		const cells = parseCsvLine(line);
		return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? ""]));
	});
	return { headers, rows };
};
