import * as prismicH from "@prismicio/helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Shiitake from "shiitake";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./SketchplanationsStack.module.css";

import "swiper/css";
import "swiper/css/effect-cards";
import { isBlank } from "helpers";
import { PrismicNextImage } from "@prismicio/next";
import SketchplanationCard from "./SketchplanationCard";

const SketchplanationsStack = ({ title, sketchplanations }) => {
	const [swiperRef, setSwiperRef] = useState(null);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [currentSketchplanation, setCurrentSketchplanation] = useState(
		sketchplanations[0],
	);

	const handleSlideChange = (swiper) => {
		setCurrentSlide(swiper.activeIndex);
		setCurrentSketchplanation(sketchplanations[swiper.activeIndex]);
	};

	const isBeginning = currentSlide === 0;
	const isEnd = currentSlide === sketchplanations.length - 1;

	if (isBlank(sketchplanations)) return null;

	return (
		<div className="sticky top-0">
			<div className="flex flex-row gap-4 justify-between mb-3 font-semibold text-base">
				{title}
				<div className="flex flex-row ml-auto">
					<button
						type="button"
						onClick={() => swiperRef.slidePrev()}
						disabled={isBeginning}
						className={isBeginning ? "opacity-50 cursor-not-allowed" : ""}
					>
						<ChevronLeft />
					</button>
					<button
						type="button"
						onClick={() => swiperRef.slideNext()}
						disabled={isEnd}
						className={isEnd ? "opacity-50 cursor-not-allowed" : ""}
					>
						<ChevronRight />
					</button>
				</div>
			</div>
			<div className={styles.swiper}>
				<Swiper
					onSwiper={setSwiperRef}
					effect="cards"
					grabCursor={true}
					modules={[EffectCards]}
					onSlideChange={handleSlideChange}
					cardsEffect={{
						perSlideOffset: 7,
						// slideShadows: false,
					}}
				>
					{sketchplanations.map((sketchplanation) => (
						<SwiperSlide key={sketchplanation.id} className={styles.slide}>
							{/* <Link href={`/${sketchplanation.uid}`} className="block bg-bg">
								<div className={styles.image}>
									<PrismicNextImage
										field={sketchplanation.data.image}
										className={styles.image}
										fill={true}
										imgixParams={{ fit: "crop", crop: "top", ar: "5:3" }}
										fallbackAlt={sketchplanation.data.title}
									/>
								</div>
							</Link> */}
							<SketchplanationCard sketchplanation={sketchplanation} />
						</SwiperSlide>
					))}
				</Swiper>
			</div>
			{/* <div className="font-semibold mb-1 mt-4">
				{currentSketchplanation.data.title}
			</div> */}
			<Shiitake lines={3} throttleRate={200} className="text-textSubdued mt-1">
				{prismicH.asText(currentSketchplanation.data.body)}
			</Shiitake>
		</div>
	);
};

export default SketchplanationsStack;
