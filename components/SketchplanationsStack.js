import * as prismicH from "@prismicio/helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Shiitake from "shiitake";
import { EffectCards } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import styles from "./SketchplanationsStack.module.css";

import { isBlank } from "helpers";
import { loadSwiperStyles } from "helpers/loadSwiperStyles";

import NavContextScope from "./NavContextScope";
import SketchplanationCard from "./SketchplanationCard";

const SketchplanationsStack = ({
	title,
	sketchplanations,
	imageProps = {},
}) => {
	const [swiperRef, setSwiperRef] = useState(null);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [currentSketchplanation, setCurrentSketchplanation] = useState(
		sketchplanations[0],
	);

	useEffect(() => {
		loadSwiperStyles({ effectCards: true });
	}, []);

	const handleSlideChange = (swiper) => {
		setCurrentSlide(swiper.activeIndex);
		setCurrentSketchplanation(sketchplanations[swiper.activeIndex]);
	};

	const isBeginning = currentSlide === 0;
	const isEnd = currentSlide === sketchplanations.length - 1;

	if (isBlank(sketchplanations)) return null;

	return (
		<div className={styles.root}>
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
			<NavContextScope context={null} className={styles.swiper}>
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
							<SketchplanationCard
								sketchplanation={sketchplanation}
								imageProps={imageProps}
							/>
						</SwiperSlide>
					))}
				</Swiper>
			</NavContextScope>
			{/* <div className="font-semibold mb-1 mt-4">
				{currentSketchplanation.data.title}
			</div> */}
			<div className="block h-[3rlh]">
				<Shiitake
					lines={3}
					throttleRate={200}
					className="text-textSubdued mt-1"
				>
					{prismicH.asText(currentSketchplanation.data.body)}
				</Shiitake>
			</div>
		</div>
	);
};

export default SketchplanationsStack;
