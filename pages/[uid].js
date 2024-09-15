import * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import classNames from "classnames";
import { ImageJsonLd } from "next-seo";
import dynamic from "next/dynamic";
import Head from "next/head";
import React, { useState, Fragment } from "react";
import { useRandomHandle } from "hooks/useRandomHandle";

import styles from "./[uid].module.css";

import SketchplanationImage from "components/SketchplanationImage";
import SubscribeInline from "components/SubscribeInline";
import { humanizePublishedDate, isPresent, pageTitle } from "helpers";

import { client } from "services/prismic";

import Page from "components/Page";
import RichText from "components/RichText";
import SketchplanationCtas from "components/SketchplanationCtas";
import SketchplanationsStack from "components/SketchplanationsStack";

import TaggedSketchplanations from "components/TaggedSketchplanations";
import { PrismicNextImage } from "@prismicio/next";
import Cards from "components/Cards";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/router";
import KeyboardShortcut from "components/KeyboardShortcut";
import FancyLink from "components/FancyLink";
import { ArrowLeft } from "lucide-react";
import { ArrowRight } from "lucide-react";

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

// const randomTitles = [
// 	"Feeling adventurous?",
// 	"Explore something new",
// 	"Take a chance",
// 	"Random inspiration",
// 	"Surprise yourself",
// 	"Discover a gem",
// 	"Serendipity awaits",
// 	"Roll the dice",
// 	"Unexpected insights",
// 	"Lucky dip",
// 	"Broaden your horizons",
// 	"Curiosity’s reward",
// ];

const SketchplanationPage = ({
	sketchplanation,
	subscribeInlineDoc,
	similarSketchplanations,
	licenceDoc,
	tags,
	olderUid,
	newerUid,
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
	// const [randomTitle, setRandomTitle] = useState("");
	const randomHandle = useRandomHandle([uid]);

	const publishedText = humanizePublishedDate(publishedAt);

	const commonProps = {
		title,
		podcastLinkUrl,
		onDownload: () => setPwywModalOpen(true),
		redbubbleLinkUrl,
		onViewLicence: () => setLicenceModalOpen(true),
	};

	const router = useRouter();

	useHotkeys(
		"right, k",
		() => {
			if (olderUid) {
				router.push(`/${olderUid}`);
			}
		},
		{},
		[router, olderUid],
	);

	useHotkeys(
		"left, j",
		() => {
			if (newerUid) {
				router.push(`/${newerUid}`);
			}
		},
		{},
		[router, newerUid],
	);

	useHotkeys(
		"r",
		() => {
			if (randomHandle) {
				router.push(`/${randomHandle}`);
			}
		},
		{},
		[router, randomHandle],
	);

	// useEffect(() => {
	// 	setRandomTitle(
	// 		randomTitles[Math.floor(Math.random() * randomTitles.length)],
	// 	);
	// }, [uid]);

	return (
		<Fragment key={uid}>
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
				<Page document={licenceDoc} inline />
			</Modal>

			<div className={styles.root}>
				<div className={styles.articleWrapper}>
					<article className={styles.article}>
						<div className={styles.title}>
							<TextHeader>{title}</TextHeader>
						</div>
						<div className={styles.image}>
							{image.dimensions.width < 790 && (
								<div className="absolute inset-0">
									<PrismicNextImage
										field={image}
										className="absolute inset-0 w-full h-full object-cover"
										width={100}
										height={100}
										imgixParams={{
											width: 100,
											blur: 100,
										}}
									/>
									<div className="absolute inset-0 backdrop-blur-md backdrop-brightness-75" />
								</div>
							)}
							<SketchplanationImage
								image={image}
								title={title}
								priority={true}
								onDownload={() => setPwywModalOpen(true)}
							>
								<SketchplanationCtas {...commonProps} variant="lightbox" />
							</SketchplanationImage>
						</div>

						<div className={styles["ctas-area"]}>
							<SketchplanationCtas {...commonProps} />
						</div>

						<div className={styles.main}>
							<div className={classNames(styles.body, "prose lg:prose-lg")}>
								<RichText field={body} />
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
								<SubscribeInline doc={subscribeInlineDoc} />
								<Cards />
							</div>

							<div className="md:sticky top-[65px]">
								{isPresent(similarSketchplanations) && (
									<div className={styles.related}>
										<SketchplanationsStack
											title="Keep exploring"
											sketchplanations={similarSketchplanations}
										/>
									</div>
								)}

								{/* <div className="mt-10">
									<p className="font-semibold text-base">{randomTitle}</p>
									<Link
										href={`/${randomHandle}`}
										className="btn-secondary text-base mt-4 rounded-lg"
									>
										Random sketch <Shuffle size={16} />
									</Link>
								</div> */}

								<div className="mt-10">
									<div className="flex gap-4">
										<div className="flex flex-row items-center gap-x-2">
											<KeyboardShortcut
												shortcut="←"
												icon={<ArrowLeft size={14} strokeWidth={1.5} />}
											/>
											<FancyLink href={`/${newerUid}`}>Newer</FancyLink>
										</div>
										<div className="flex flex-row mx-auto items-center gap-x-2">
											<KeyboardShortcut shortcut="R" />
											<FancyLink href={`/${randomHandle}`}>Random</FancyLink>
										</div>
										<div className="flex flex-row items-center gap-x-2">
											<FancyLink href={`/${olderUid}`}>Older</FancyLink>
											<KeyboardShortcut
												shortcut="→"
												icon={<ArrowRight size={14} strokeWidth={1.5} />}
											/>
										</div>
									</div>
								</div>
							</div>
						</aside>
					</article>
				</div>

				<div className={styles.footer}>
					<TaggedSketchplanations tags={tags} excludeUid={uid} />
				</div>
			</div>
		</Fragment>
	);
};

export async function getStaticProps({ params: { uid } }) {
	const sketchplanation = await client.getByUID("sketchplanation", uid);

	const olderUid =
		(
			await client.getByType("sketchplanation", {
				pageSize: 1,
				after: sketchplanation.id,
				graphQuery: `{
					sketchplanation {
						uid
					}
				}`,
				orderings: [
					{
						field: "my.sketchplanation.published_at",
						direction: "desc",
					},
				],
			})
		)?.results?.[0]?.uid || null;

	const newerUid =
		(
			await client.getByType("sketchplanation", {
				pageSize: 1,
				after: sketchplanation.id,
				graphQuery: `{
					sketchplanation {
						uid
					}
				}`,
				orderings: [
					{
						field: "my.sketchplanation.published_at",
					},
				],
			})
		)?.results?.[0]?.uid || null;

	const similarSketchplanations = (
		await client.getByType("sketchplanation", {
			filters: [prismic.filter.similar(sketchplanation.id, 10)],
			pageSize: 6,
		})
	).results;

	const subscribeInlineDoc = await client.getSingle("subscribe_inline");
	const licenceDoc = await client.getSingle("licence");

	const tags = sketchplanation.data.tags;

	return {
		props: {
			sketchplanation,
			subscribeInlineDoc,
			similarSketchplanations,
			licenceDoc,
			tags,
			olderUid,
			newerUid,
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
