import classNames from "classnames";
import dynamic from "next/dynamic";

import { createElement } from "react";

import styles from "./Page.module.css";

import RichText from "./RichText";

import { PrismicNextImage } from "@prismicio/next";

const TextHeader = dynamic(() => import("./TextHeader"));

const Text = ({ slice }) => <RichText field={slice.primary.content} />;

const Photo = ({
	slice: {
		primary: { photo },
	},
}) => (
	<div className="w-full max-w-[30rem] mx-auto">
		<PrismicNextImage
			className="block w-full"
			field={photo}
			width={photo.dimensions.width}
			height={photo.dimensions.height}
			alt={photo.alt}
			sizes="(min-width: 30rem) 30rem, calc(100vw - 3rem)"
		/>
	</div>
);

const Html = dynamic(() => import("./HtmlComponent"), { ssr: false });

const sliceTypesToComponent = {
	text: Text,
	photo: Photo,
	html: Html,
};

const Page = ({
	document: {
		data: { title, body },
	},
	inline = false,
	children,
}) => {
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
				{/* {body.map((slice, index) => (
					<Debug key={index}>{slice}</Debug>
				))} */}
				{body.map((slice, index) =>
					createElement(sliceTypesToComponent[slice.slice_type], {
						key: index,
						slice,
					}),
				)}
				{children}
			</div>
		</div>
	);
};

export default Page;
