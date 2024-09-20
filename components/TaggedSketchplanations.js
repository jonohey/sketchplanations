import { humanizeTag, isPresent } from "helpers";
import { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { useInView } from "react-intersection-observer";
import { RoughNotation } from "react-rough-notation";
import { FreeMode, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import FancyLink from "./FancyLink";
import SketchplanationCard from "./SketchplanationCard";
import styles from "./TaggedSketchplanations.module.css";

const TaggedSketchplanations = ({ tags, excludeUid }) => {
	const [taggedSketchplanations, setTaggedSketchplanations] = useState([]);
	const { ref, inView } = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	useEffect(() => {
		const fetchTaggedSketchplanations = async () => {
			if (inView) {
				const res = await fetch(
					`/api/taggedSketchplanations?tags=${JSON.stringify(tags)}&excludeUid=${excludeUid}`,
				);
				const data = await res.json();
				setTaggedSketchplanations(data);
			}
		};

		fetchTaggedSketchplanations();
	}, [inView, tags, excludeUid]);

	const swiperProps = {
		grabCursor: true,
		slidesPerView: "auto",
		spaceBetween: 20,
		mousewheel: {
			enabled: true,
			forceToAxis: true,
		},
		freeMode: true,
		modules: [Mousewheel, FreeMode],
	};

	return (
		<div ref={ref} className="overflow-hidden">
			<div className={styles.header}>
				<div className="mb-3 text-xl font-semibold">More on these topics</div>
			</div>
			<Tabs>
				<div className={styles.tabsList}>
					<TabList className="flex flex-row gap-x-4">
						{isPresent(taggedSketchplanations) ? (
							<>
								{taggedSketchplanations.map(({ tag }) => (
									<Tab
										key={tag.id}
										id={tag.id}
										className={({ isSelected }) =>
											[
												isSelected ? "text-blue" : "bg-transparent",
												"outline-none cursor-pointer hover:text-blue",
											].join(" ")
										}
									>
										{({ isSelected }) => (
											<RoughNotation
												show={isSelected}
												iterations={1}
												animate={false}
												strokeWidth={1}
												multiline
												padding={3}
											>
												{humanizeTag(tag.slug)}
											</RoughNotation>
										)}
									</Tab>
								))}
							</>
						) : (
							<Tab id="empty">
								<RoughNotation
									show={false}
									iterations={1}
									animate={false}
									strokeWidth={1}
									multiline
									padding={3}
								>
									…
								</RoughNotation>
							</Tab>
						)}
					</TabList>
				</div>
				{isPresent(taggedSketchplanations) ? (
					<>
						{taggedSketchplanations.map(({ tag, sketchplanations }) => (
							<TabPanel key={tag.id} id={tag.id}>
								<div className={styles.taggedSketchplanations}>
									<Swiper {...swiperProps}>
										{sketchplanations.map((sketchplanation) => (
											<SwiperSlide key={[tag.id, sketchplanation.id].join("-")}>
												<SketchplanationCard
													sketchplanation={sketchplanation}
													imageProps={{
														sizes:
															"(max-width: 640px) 60vw, (max-width: 1024px) 39vw, 27vw",
													}}
												/>
											</SwiperSlide>
										))}
									</Swiper>
								</div>
								<div className={styles.seeAllLink}>
                  					<FancyLink href={`/categories/${tag.slug}`}>
										All {humanizeTag(tag.slug)} sketches &raquo;
									</FancyLink>
								</div>
							</TabPanel>
						))}
					</>
				) : (
					<>
						<TabPanel id="empty">
							<div className={styles.taggedSketchplanations}>
								<Swiper {...swiperProps}>
									{/* 10 empty slides  */}
									{Array.from({ length: 10 }).map((_, index) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: It's not possible to use the key as a string
										<SwiperSlide key={index}>
											<SketchplanationCard isLoading={true} />
										</SwiperSlide>
									))}
								</Swiper>
							</div>
						</TabPanel>
					</>
				)}
			</Tabs>
		</div>
	);
};

export default TaggedSketchplanations;
