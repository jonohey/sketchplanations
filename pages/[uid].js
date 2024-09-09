import * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import classNames from "classnames";
import { ImageJsonLd } from "next-seo";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRandomHandle } from "hooks/useRandomHandle";

import styles from "./[uid].module.css";

import SketchplanationImage from "components/SketchplanationImage";
import SubscribeInline from "components/SubscribeInline";
import { humanizePublishedDate, humanizeTag, pageTitle } from "helpers";
import bigIdeasLittlePicturesImage from "images/bigideaslittlepictures.jpg";
import podcastImage from "images/podcast.jpg";
import { client } from "services/prismic";
import { ExternalLink } from "lucide-react";
import Page from "components/Page";
import RichText from "components/RichText";
import SketchplanationCtas from "components/SketchplanationCtas";
import SketchplanationCards from "components/SketchplanationCards";
import { Shuffle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import { FreeMode, Mousewheel } from "swiper/modules";
import { Tabs } from "react-aria-components";
import { TabList } from "react-aria-components";
import { Tab } from "react-aria-components";
import { TabPanel } from "react-aria-components";
import { RoughNotation } from "react-rough-notation";

// const SocialSharing = dynamic(() => import('components/SocialSharing'))
const TextHeader = dynamic(() => import("components/TextHeader"));
const PayWhatYouWant = dynamic(() => import("components/PayWhatYouWant"));
const Modal = dynamic(() => import("components/Modal"));

const truncate = (string, limit) => {
	if (string.length <= limit) return string;

	const words = string.split(" ");
	let truncatedString = "";

	for (let i = 0; i < words.length; i++) {
		if (truncatedString.length + words[i].length + 1 <= limit - 1) {
			truncatedString += `${words[i]} `;
		} else {
			break;
		}
	}

	// Add ellipsis if the original string was truncated
	if (truncatedString.length < string.length) {
		truncatedString = `${truncatedString.trim()}…`;
	}

	return truncatedString;
};

const SketchplanationPage = ({
	sketchplanation,
	subscribeInlineDoc,
	similarSketchplanations,
	licenceDocument,
	taggedSketchplanations,
}) => {
	const {
		data: {
			image,
			title,
			body,
			published_at: publishedAt,
			redbubble_link_url: redbubbleLinkUrl,
			podcast_link_url: podcastLinkUrl,
		},
		uid,
	} = sketchplanation;

	const [pwywModalOpen, setPwywModalOpen] = useState(false);
	const [licenceModalOpen, setLicenceModalOpen] = useState(false);
	const randomHandle = useRandomHandle();

	const publishedText = humanizePublishedDate(publishedAt);

	const commonProps = {
		title,
		podcastLinkUrl,
		onDownload: () => setPwywModalOpen(true),
		redbubbleLinkUrl,
		onViewLicence: () => setLicenceModalOpen(true),
	};

	return (
		<div key={sketchplanation.uid}>
			<Head>
				<title>{pageTitle(title)}</title>
				<meta name="robots" content="max-image-preview:large" />
				<meta
					name="description"
					content={truncate(prismicH.asText(body), 160)}
				/>
				<meta key="og:title" property="og:title" content={title} />
				<meta property="og:description" content={prismicH.asText(body)} />
				<meta property="og:image" content={`${image.url}&w=1200`} />
				<meta
					property="og:url"
					content={`https://sketchplanations.com/${uid}`}
				/>
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:image:alt" content={title} />
			</Head>

			<ImageJsonLd
				images={[
					{
						contentUrl: `${image.url}&w=1200`,
						thumbnail: {
							type: "ImageObject",
							url: `${image.url}&w=200`,
						},
						creator: {
							"@type": "Person",
							name: "Jono Hey",
						},
						creditText: "Jono Hey",
						copyrightNotice:
							"Creative Commons Attribution-NonCommercial 4.0 International License",
						license: "https://creativecommons.org/licenses/by-nc/4.0/",
						acquireLicensePage: "https://sketchplanations.com/licence",
						name: title,
						caption: image.alt,
						description: prismicH.asText(body),
						isFamilyFriendly: true,
						representativeOfPage: true,
						datePublished: publishedAt,
					},
				]}
			/>

			<Modal
				isOpen={pwywModalOpen}
				onClose={() => setPwywModalOpen(false)}
				onOpenChange={setPwywModalOpen}
			>
				<div className={styles.pwyw}>
					<PayWhatYouWant
						sketchplanationUid={sketchplanation.uid}
						sketchplanationTitle={title}
					/>
				</div>
			</Modal>

			<Modal
				isOpen={licenceModalOpen}
				onClose={() => setLicenceModalOpen(false)}
				onOpenChange={setLicenceModalOpen}
			>
				<Page document={licenceDocument} inline />
			</Modal>

			<div className={styles.wrapper}>
				<article className={styles.root}>
					<div className={styles.title}>
						<TextHeader>{title}</TextHeader>
					</div>
					<div className={styles.image}>
						<SketchplanationImage
							image={image}
							title={title}
							priority={true}
							onDownload={() => setPwywModalOpen(true)}
						>
							<SketchplanationCtas {...commonProps} />
						</SketchplanationImage>
					</div>

					<div className={styles["ctas-area"]}>
						<SketchplanationCtas {...commonProps} />
					</div>

					<div className={styles.main}>
						<div className={classNames(styles.body, "prose")}>
							<RichText field={body} className="prose" />
							<div className={styles["published-at"]}>
								Published <time dateTime={publishedAt}>{publishedText}</time>
							</div>
						</div>
						{/* <ul className={styles.tags}>
							{tags.map((tag) => (
								<li key={tag.tag.id}>
									<Link key={tag} href={`/categories/${tag.tag.slug}`}>
										{tag.tag.slug.replace(/-/, " ")}
									</Link>
								</li>
							))}
						</ul> */}
					</div>
					<aside className={styles.sidebar}>
						<div className={styles.cards}>
							<Card
								href="/big-ideas-little-pictures"
								imageSrc={bigIdeasLittlePicturesImage}
								alt="Big Ideas Little Pictures"
								content={
									<>
										Sketchplanations is now a book! I think you’ll love{" "}
										<Link href="/big-ideas-little-pictures">
											Big Ideas Little Pictures
										</Link>
									</>
								}
							/>
							<Card
								href="/thanks"
								content={
									<>
										Thanks to <Link href="/thanks">my Patrons</Link> for
										enabling me to keep creating Sketchplanations 🙏
									</>
								}
							/>
							<Card
								href="https://podcast.sketchplanations.com/"
								imageSrc={podcastImage}
								alt="Big Ideas Little Pictures"
								content={
									<>
										Prefer to listen to the ideas on your commute or while doing
										chores? I don’t blame you.
										<a
											className="inline-flex flex-row gap-x-1 items-center"
											href="https://podcast.sketchplanations.com/"
											target="_blank"
											rel="noreferrer"
										>
											Listen to the podcast
											<ExternalLink size={16} />
										</a>
									</>
								}
							/>
							<SubscribeInline doc={subscribeInlineDoc} />
						</div>

						<div className="md:sticky top-[65px]">
							<div className={styles.related}>
								<SketchplanationCards
									title="Explore similar"
									sketchplanations={similarSketchplanations}
								/>
							</div>

							<div className="mt-10">
								<p className="font-semibold text-base">Feeling adventurous?</p>
								<Link
									href={`/${randomHandle}`}
									className="btn-secondary text-base mt-4"
								>
									Random sketch <Shuffle strokeWidth={1} size={16} />
								</Link>
							</div>
						</div>
					</aside>
				</article>
			</div>

			<div className={styles.footer}>
				<Tabs className="w-full overflow-hidden">
					<div className="flex flex-row gap-x-4 px-6">
						<span className="font-semibold">Related</span>
						<TabList aria-label="Related" className="flex flex-row gap-x-4">
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
											// animationDuration={150}
											// animationDelay={100}
											strokeWidth={1}
											multiline
											padding={3}
										>
											{humanizeTag(tag.slug)}
										</RoughNotation>
									)}
								</Tab>
							))}
						</TabList>
					</div>
					{taggedSketchplanations.map(({ tag, sketchplanations }) => (
						<TabPanel key={tag.id} id={tag.id}>
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
									{sketchplanations.map((sketchplanation) => (
										<SwiperSlide key={sketchplanation.id}>
											<Link
												href={`/${sketchplanation.uid}`}
												className={classNames("group", styles.taggedSketch)}
											>
												<div className="relative w-full aspect-[5/3]">
													<Image
														src={sketchplanation.data.image.url}
														title={sketchplanation.data.title}
														className="bg-paper object-cover object-top w-[10rem]"
														// width={sketchplanation.data.image.dimensions.width}
														// height={sketchplanation.data.image.dimensions.height}
														fill={true}
														alt={sketchplanation.data.title}
													/>
												</div>
												<div className="absolute bottom-0 left-0 w-full bg-paperTransparent backdrop-blur-lg font-semibold text-sm px-4 py-3 text-[#222] group-hover:text-red border-t border-paperDarker whitespace-nowrap overflow-hidden text-ellipsis">
													{sketchplanation.data.title}
												</div>
											</Link>
										</SwiperSlide>
									))}
								</Swiper>
							</div>
						</TabPanel>
					))}
				</Tabs>

				{/* {taggedSketchplanations.map(({ tag, sketchplanations }) => (
					<div key={tag.id} className="-mt-5 overflow-x-hidden">
						<div key={tag.id} className="w-full overflow-hidden">
							<div className="sm:mx-6 flex flex-row gap-x-3 items-center -mb-4">
								<h2 className="text-lg font-semibold text-white">
									{humanizeTag(tag.slug)}
								</h2>
								<Link
									className="link-primary text-sm"
									href={`/categories/${tag.slug}`}
								>
									View all
								</Link>
							</div>
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
									{sketchplanations.map((sketchplanation) => (
										<SwiperSlide key={sketchplanation.id}>
											<Link
												href={`/${sketchplanation.uid}`}
												className={classNames("group", styles.taggedSketch)}
											>
												<div className="relative w-full aspect-[5/2]">
													<Image
														src={sketchplanation.data.image.url}
														title={sketchplanation.data.title}
														className="bg-paper object-cover object-top w-[10rem] truncated-sketchplanation-image"
														// width={sketchplanation.data.image.dimensions.width}
														// height={sketchplanation.data.image.dimensions.height}
														fill={true}
														alt={sketchplanation.data.title}
													/>
												</div>
												<div className="font-semibold text-sm px-4 py-3 text-[#222] group-hover:text-red border-t border-paperDarker whitespace-nowrap overflow-hidden text-ellipsis">
													{sketchplanation.data.title}
												</div>
											</Link>
										</SwiperSlide>
									))}
								</Swiper>
							</div>
						</div>
					</div>
				))} */}
			</div>
		</div>
	);
};

const Card = ({ href, imageSrc, alt, content }) => (
	<div className={styles.card}>
		{imageSrc && (
			<Link href={href}>
				<Image src={imageSrc} alt={alt} width={114} className="w-full" />
			</Link>
		)}
		<p>{content}</p>
	</div>
);

export async function getStaticProps({ params: { uid } }) {
	const sketchplanation = await client.getByUID("sketchplanation", uid);
	const subscribeInlineDoc = await client.getSingle("subscribe_inline");
	const similarSketchplanations = (
		await client.getByType("sketchplanation", {
			filters: [prismic.filter.similar(sketchplanation.id, 30)],
			pageSize: 6,
		})
	).results;
	const licenceDocument = await client.getSingle("licence");

	const tags = sketchplanation.data.tags;

	const taggedSketchplanations = await Promise.all(
		tags.map(async (tag) => {
			const taggedSketches = await client.getAllByType("sketchplanation", {
				filters: [
					prismic.filter.at("my.sketchplanation.tags.tag", tag.tag.id),
					prismic.filter.not("my.sketchplanation.uid", uid),
				],
			});

			if (taggedSketches.length === 0) return null;

			return {
				tag: tag.tag,
				sketchplanations: taggedSketches.sort(() => Math.random() - 0.5),
			};
		}),
	);

	const filteredTaggedSketchplanations = taggedSketchplanations.filter(Boolean);

	return {
		props: {
			sketchplanation,
			subscribeInlineDoc,
			similarSketchplanations,
			licenceDocument,
			tags,
			taggedSketchplanations: filteredTaggedSketchplanations,
		},
	};
}

export async function getStaticPaths() {
	const sketchplanations = await client.getAllByType("sketchplanation");
	const sketchplanationsPaths = sketchplanations.map((sketchplanation) => ({
		params: { uid: sketchplanation.uid },
	}));

	return {
		paths: sketchplanationsPaths,
		fallback: false,
	};
}

export default SketchplanationPage;
