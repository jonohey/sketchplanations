export default function imgixLoader({ src, width, quality }) {
	try {
		const url = new URL(src);
		const params = url.searchParams;
		params.set("auto", params.getAll("auto").join(",") || "format");
		params.set("fit", params.get("fit") || "max");
		params.set("w", params.get("w") || width?.toString());
		params.set("q", quality?.toString() || "50");
		return url.href;
	} catch (e) {
		return src;
	}
}
