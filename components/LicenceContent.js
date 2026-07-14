import classNames from "classnames";
import dynamic from "next/dynamic";
import { createElement } from "react";
import LicenceRichText from "./LicenceRichText";
import styles from "./Page.module.css";
import {
	BOOKS_SECTION_ID,
	BOOKS_SECTION_TITLE,
	getLicenceSections,
	splitLicenceFaqContent,
} from "utils/licenceContent.mjs";

const TextHeader = dynamic(() => import("./TextHeader"));
const Html = dynamic(() => import("./HtmlComponent"), { ssr: false });

const Text = ({ slice, variant = "default" }) => (
	<LicenceRichText field={slice.primary.content} variant={variant} />
);

const BooksSection = ({ content }) => {
	if (!content.length) return null;

	return (
		<section id={BOOKS_SECTION_ID} className="scroll-mt-24">
			<h2>{BOOKS_SECTION_TITLE}</h2>
			<LicenceRichText field={content} />
		</section>
	);
};

const LicenceSectionNav = ({ sections }) => (
	<nav
		aria-label="Licence page sections"
		className="not-prose my-6 rounded-lg border border-border bg-bgHighlight px-4 py-3"
	>
		<p className="m-0 text-xs font-semibold uppercase tracking-wide text-textSubdued">
			On this page
		</p>
		<ul className="m-0 mt-2 grid list-none gap-2 p-0 text-sm sm:grid-cols-2">
			{sections.map(({ id, label }) => (
				<li key={id}>
					<a href={`#${id}`} className="text-blue dark:text-blueLight">
						{label}
					</a>
				</li>
			))}
		</ul>
	</nav>
);

const LicenceContent = ({
	document: {
		data: { title, body },
	},
	inline = false,
	showSectionNav = true,
}) => {
	const htmlSlice = body.find((slice) => slice.slice_type === "html");
	const textSlices = body.filter((slice) => slice.slice_type === "text");
	const mainTextSlice = textSlices[0];
	const faqTextSlice = textSlices[1];
	const { faqContent, booksContent } = faqTextSlice
		? splitLicenceFaqContent(faqTextSlice.primary.content)
		: { faqContent: [], booksContent: [] };
	const sections = getLicenceSections({
		hasBooksSection: booksContent.length > 0,
	});

	return (
		<div
			className={classNames(
				styles["page-root"],
				inline && styles["page-root--inline"],
				"prose",
			)}
		>
			<TextHeader>{title}</TextHeader>
			<div className={styles["page-body"]}>
				{htmlSlice &&
					createElement(Html, {
						slice: htmlSlice,
					})}

				{showSectionNav && !inline && (
					<LicenceSectionNav sections={sections} />
				)}

				{mainTextSlice &&
					createElement(Text, {
						slice: mainTextSlice,
					})}

				<BooksSection content={booksContent} />

				{faqTextSlice && (
					<LicenceRichText field={faqContent} variant="faq" />
				)}
			</div>
		</div>
	);
};

export default LicenceContent;
