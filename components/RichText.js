import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import { LinkType } from "@prismicio/types";
import { compile, match } from "path-to-regexp";
import redirects from "redirects.mjs";
import sketchTooltipsData from "../sketch-tooltips-data.json";
import SketchTooltip from "./SketchTooltip";
import FancyLink from "./FancyLink";

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
					const link = {
						...node.data,
						url: rewriteWithRedirects(maybeRelativeUrl(node.data.url)),
					};

					// Sketchplanations links
					if (link.link_type === LinkType.Web) {
						const uid = extractSketchplanationsUid(link.url);
						const image = sketchTooltipsData.find(
							({ uid: dataUid }) => dataUid === uid,
						);

						if (image) {
							return (
								<SketchTooltip uid={uid}>
									<FancyLink as={PrismicNextLink} field={link}>
										{children}
									</FancyLink>
								</SketchTooltip>
							);
						}
					}

					// Tag links
					if (
						link.link_type === LinkType.Web &&
						/\/tags(\/|$)/.test(link.url)
					) {
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

					return (
						<FancyLink as={PrismicNextLink} field={link}>
							{children}
						</FancyLink>
					);
				},
			}}
		/>
	);
};

export default RichText;
