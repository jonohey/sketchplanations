import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { LinkType } from "@prismicio/types";
import { compile, match } from "path-to-regexp";
import redirects from "redirects.mjs";
import sketchTooltipsData from "data/sketch-tooltips-data.json";
import SketchTooltip from "./SketchTooltip";
import FancyLink from "./FancyLink";
import { ExternalLink } from "lucide-react";
import { linkResolver } from "services/prismic.mjs";

// Example
// Input: /chestertons-fence
// Output: chestertons-fence
const extractSketchplanationsUid = (url) => {
	const regex = /\/([^/]+)$/;
	const match = url.match(regex);
	return match ? match[1] : null;
};

const maybeRelativeUrl = (url) => {
	if (!/^https?:\/\/(www\.)?sketchplanations\.com/.test(url)) return url;

	return url.replace(/^(https?:\/\/(www\.)?sketchplanations\.com)/, "");
};

const rewriteWithRedirects = (url) => {
	if (/^https?:\/\//.test(url)) return url;

	for (const redirect of redirects) {
		try {
			const matchFn = match(redirect.source, { decode: decodeURIComponent });
			const result = matchFn(url);

			if (result) {
				const escapedDestination = redirect.destination.replace(
					/^(https?):\/\//,
					"$1\\://",
				);
				const toPath = compile(escapedDestination);
				return toPath(result.params);
			}
		} catch (error) {
			console.error(
				`Error processing redirect ${redirect.source} -> ${redirect.destination}:`,
				error,
			);
		}
	}

	return url;
};

const RichText = ({ ...props }) => {
	return (
		<PrismicRichText
			{...props}
			components={{
				hyperlink: ({ node, children }) => {
					let url = node.data.url;

					if (node.data.link_type === LinkType.Document) {
						url = linkResolver(node.data);
					}

					const link = {
						...node.data,
						url: rewriteWithRedirects(maybeRelativeUrl(url)),
					};

					// Sketchplanations links
					const uid = extractSketchplanationsUid(link.url);
					const image = sketchTooltipsData.find(
						({ uid: dataUid }) => dataUid === uid,
					);

					if (image) {
						return (
							<span className="not-prose">
								<SketchTooltip uid={uid}>
									<FancyLink as={PrismicNextLink} field={link}>
										{children}
									</FancyLink>
								</SketchTooltip>
							</span>
						);
					}

					// Tag links
					if (/\/tags(\/|$)/.test(link.url)) {
						const correctedUrl = link.url.replace(
							/\/tags(\/|$)/,
							(_, slash) => `/categories${slash || ""}`,
						);

						if (correctedUrl)
							return (
								<FancyLink
									as={PrismicNextLink}
									field={{ ...link, url: correctedUrl }}
								>
									{children}
								</FancyLink>
							);
					}

					// External links
					if (/^https?:\/\//.test(link.url)) {
						return (
							<FancyLink href={link.url} target="_blank" rel="noopener">
								<span className="inline">
									<span>{children}</span>{" "}
									<ExternalLink
										size={16}
										className="inline relate -translate-y-[2px]"
									/>
								</span>
							</FancyLink>
						);
					}

					return <FancyLink href={link.url}>{children}</FancyLink>;
				},
			}}
		/>
	);
};

export default RichText;
