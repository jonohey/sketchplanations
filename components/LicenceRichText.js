import { asText } from "@prismicio/client";
import { slugifyHeading } from "helpers/slugifyHeading";
import { isFaqQuestion } from "utils/licenceContent.mjs";
import RichText from "./RichText";

const headingComponents = {
	heading2: ({ node, children }) => {
		const id = slugifyHeading(asText(node));
		return (
			<h2 id={id} className="scroll-mt-24">
				{children}
			</h2>
		);
	},
	heading3: ({ node, children }) => {
		const id = slugifyHeading(asText(node));
		return (
			<h3 id={id} className="scroll-mt-24">
				{children}
			</h3>
		);
	},
};

const faqQuestionComponents = {
	...headingComponents,
	paragraph: ({ node, children }) => {
		if (isFaqQuestion(node)) {
			const id = slugifyHeading(asText(node));
			return (
				<h3 id={id} className="scroll-mt-24 mt-8 mb-2 text-xl font-semibold">
					{children}
				</h3>
			);
		}

		if (!asText(node).trim()) return null;

		return <p>{children}</p>;
	},
};

const LicenceRichText = ({ field, variant = "default" }) => {
	const components =
		variant === "faq" ? faqQuestionComponents : headingComponents;

	return (
		<RichText
			field={field}
			components={{
				...components,
			}}
		/>
	);
};

export default LicenceRichText;
