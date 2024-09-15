import { PrismicNextImage } from "@prismicio/next";
import dynamic from "next/dynamic";
import { createElement } from "react";
import RichText from "./RichText";

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

const InlinePage = ({
	document: {
		data: { title, body },
	},
	children,
}) => {
	return (
		<div className="relative">
			<TextHeader>{title}</TextHeader>
			<div className="prose">
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

export default InlinePage;
