import Link from "next/link";
import Image from "next/image";

const SketchplanationCard = ({ sketchplanation, imageProps = {} }) => (
	<Link
		href={`/${sketchplanation.uid}`}
		className="group block rounded overflow-hidden bg-paper scale-[0.94] hover:scale-100 relative hover:z-[2] transition-all shadow-sm hover:shadow-lg"
	>
		<span className="block relative w-full aspect-[5/3] bg-paper">
			<Image
				{...imageProps}
				src={sketchplanation.data.image.url}
				title={sketchplanation.data.title}
				className="object-cover object-top w-[10rem]"
				fill={true}
				alt={sketchplanation.data.title}
			/>
		</span>
		<span className="absolute bottom-0 left-0 w-full bg-paperTransparent backdrop-blur-lg font-semibold text-sm px-4 py-3 text-[#222] group-hover:text-red border-t border-paperDarker whitespace-nowrap overflow-hidden text-ellipsis">
			{sketchplanation.data.title}
		</span>
	</Link>
);

export default SketchplanationCard;
