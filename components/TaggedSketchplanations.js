import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import classNames from "classnames";
import { TabList, Tab, Tabs, TabPanel } from "react-aria-components";
import { useEffect, useState } from "react";
import { RoughNotation } from "react-rough-notation";
import { humanizeTag, isPresent } from "helpers";
import { useInView } from "react-intersection-observer";

import styles from "./TaggedSketchplanations.module.css";
import { LoaderCircle } from "lucide-react";
import SketchplanationCard from "./SketchplanationCard";

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

	return (
		<div ref={ref} className="overflow-hidden">
			<Tabs>
				<div className="flex flex-row gap-x-4 px-6">
					<span className="font-semibold">Related</span>
					<TabList aria-label="Related" className="flex flex-row gap-x-4">
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
									<Swiper
										grabCursor={true}
										slidesPerView="auto"
										spaceBetween={0}
										scroll={true}
										mousewheel={{
											enabled: true,
											forceToAxis: true,
										}}
										freeMode={true}
										modules={[Mousewheel, FreeMode]}
									>
										{sketchplanations.map((sketchplanation) => (
											<SwiperSlide key={sketchplanation.id}>
												<SketchplanationCard
													sketchplanation={sketchplanation}
												/>
											</SwiperSlide>
										))}
									</Swiper>
								</div>
							</TabPanel>
						))}
					</>
				) : (
					<>
						<TabPanel id="empty">
							<div className={styles.taggedSketchplanations}>
								<Swiper
									grabCursor={true}
									slidesPerView="auto"
									spaceBetween={0}
									scroll
									mousewheel={{
										enabled: true,
										forceToAxis: true,
									}}
									freeMode={true}
									modules={[Mousewheel, FreeMode]}
								>
									{/* 10 empty slides  */}
									{Array.from({ length: 10 }).map((_, index) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: It's not possible to use the key as a string
										<SwiperSlide key={index}>
											<div className={classNames("group", styles.taggedSketch)}>
												<div className="relative w-full aspect-[5/3] bg-paper">
													<div className="flex items-center justify-center w-full h-full">
														<LoaderCircle
															className="animate-spin"
															strokeWidth={1}
															color="var(--color-paperDarker)"
															size={40}
														/>
													</div>
												</div>
												<div className="absolute bottom-0 left-0 w-full bg-paperTransparent backdrop-blur-lg font-semibold text-sm px-4 py-3 text-paperDarker group-hover:text-red border-t border-paperDarker whitespace-nowrap overflow-hidden text-ellipsis">
													…
												</div>
											</div>
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
