import { createClient } from "@prismicio/client";

export const linkResolver = (doc) => {
	const routes = {
		sketchplanation: `/${doc.uid}`,
		about: "/about",
		licence: "/licence",
		thanks: "/thanks",
		privacy: "/privacy",
		wisdom: "/wisdom",
	};
	return routes[doc.type] || "/";
};

export const client = createClient("sketchplanations");
