import * as prismicH from "@prismicio/helpers";
import { RoughNotation } from "react-rough-notation";

const FancyBlockquote = ({ html }) => (
	<RoughNotation
		animate={false}
		type="highlight"
		show={true}
		color="var(--color-paper)"
	>
		<blockquote
			className="not-prose text-[#222] p-8"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: We control the HTML
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	</RoughNotation>
);

const HtmlComponent = ({ slice }) => {
	const html = prismicH.asText(slice.primary.html);
	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = html;

	const replaceBlockquotes = (node) => {
		if (node.nodeName === "BLOCKQUOTE") {
			return <FancyBlockquote html={node.innerHTML} />;
		}
		// biome-ignore lint/security/noDangerouslySetInnerHtml: We control the HTML
		return <div dangerouslySetInnerHTML={{ __html: node.outerHTML }} />;
	};

	const processedHtml = Array.from(tempDiv.childNodes).map(replaceBlockquotes);

	return <>{processedHtml}</>;
};

export default HtmlComponent;
