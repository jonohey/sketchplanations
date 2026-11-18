import * as prismic from "@prismicio/client";
import * as prismicH from "@prismicio/helpers";
import { PrismicNextImage } from "@prismicio/next";
import classNames from "classnames";
import Context from "context";
import {
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import styles from "./[uid].module.css";

import Cards from "components/Cards";
import DownloadModal from "components/DownloadModal";
import FancyLink from "components/FancyLink";
import JsonLd from "components/JsonLd";
import KeyboardShortcut from "components/KeyboardShortcut";
import LicenceContent from "components/LicenceContent";
import RichText from "components/RichText";
import SketchNavBar from "components/SketchNavBar";
import SketchplanationCtas from "components/SketchplanationCtas";
import SketchplanationImage from "components/SketchplanationImage";
import SubscribeInline from "components/SubscribeInline";
import {
	fastScrollToTop,
	humanizePublishedDate,
	humanizeTag,
	isPresent,
	pageTitle,
	shuffle,
} from "helpers";
import { getCategoryNavData } from "helpers/categoryNavData";
import { chronologicalNeighbours, saveNavContext } from "helpers/navContext";
import shouldIgnoreShortcut from "helpers/shouldIgnoreShortcut";
import {
	buildSketchStructuredData,
	resolveSketchTagDocs,
} from "helpers/structuredData";
import useActiveNavContext from "hooks/useActiveNavContext";
import { useRandomHandle } from "hooks/useRandomHandle";
import { client } from "services/prismic";

const TextHeader = dynamic(() => import("components/TextHeader"));
const Modal = dynamic(() => import("components/Modal"));
const SketchplanationsStack = dynamic(
	() => import("components/SketchplanationsStack"),
	{
		ssr: false,
	},
);
const TaggedSketchplanations = dynamic(
	() => import("components/TaggedSketchplanations"),
	{
		ssr: false,
	},
);

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
// 	"Curiosity's reward",
// ];

const SketchplanationPage = ({
	sketchplanation,
	similarSketchplanations,
	tags,
	olderUid,
	newerUid,
}) => {
	const router = useRouter();
	const { decorationHidden } = useContext(Context);
	// This checks for ref= query param in the url and sets the noindex meta tag if it's present
	// On recommendation from SEO expert.
	const shouldNoIndex = router.query.ref !== undefined;
	const robotsContent = `max-image-preview:large${shouldNoIndex ? ", noindex, nofollow" : ""}`;

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

	const [downloadModalOpen, setDownloadModalOpen] = useState(false);
	const [licenceModalOpen, setLicenceModalOpen] = useState(false);
	const randomHandle = useRandomHandle([uid]);

	useEffect(() => {
		setDownloadModalOpen(false);
		setLicenceModalOpen(false);
	}, [uid]);

	const {
		context: navContext,
		resolution: navResolution,
		persistStep,
		prepareReturnToList,
	} = useActiveNavContext(uid);

	const hasContext = Boolean(navContext && navResolution);
	const leftTargetUid = hasContext ? navResolution.previous : newerUid;
	const rightTargetUid = hasContext ? navResolution.next : olderUid;
	const leftLabel = hasContext ? "Previous" : "Newer";
	const rightLabel = hasContext ? "Next" : "Older";

	const stepTo = useCallback(
		(targetUid) => {
			if (!targetUid) return;
			if (hasContext) persistStep(targetUid);
			router.push(`/${targetUid}`);
		},
		[hasContext, persistStep, router],
	);

	useEffect(() => {
		if (!decorationHidden) return;
		if (leftTargetUid) router.prefetch(`/${leftTargetUid}`);
		if (rightTargetUid) router.prefetch(`/${rightTargetUid}`);
	}, [decorationHidden, leftTargetUid, rightTargetUid, router]);

	const publishedText = humanizePublishedDate(publishedAt, { showYear: true });
	const description = truncate(prismicH.asText(body), 160);
	const pageUrl = `https://sketchplanations.com/${uid}`;
	const socialImageUrl = `${image.url}&w=1200`;
	const topicTags = resolveSketchTagDocs(tags);
	const structuredData = buildSketchStructuredData({
		uid,
		title,
		description: prismicH.asText(body),
		image,
		publishedAt,
		modifiedAt: sketchplanation.last_publication_date,
		tags,
	});

	const commonProps = {
		title,
		podcastLinkUrl,
		onDownload: () => setDownloadModalOpen(true),
		redbubbleLinkUrl,
		onViewLicence: () => setLicenceModalOpen(true),
		sketchplanationUid: uid,
	};

	const hasBlockingModal = () =>
		downloadModalOpen ||
		licenceModalOpen ||
		Boolean(document.querySelector("[data-mobile-nav-open]"));

	useHotkeys(
		"right, k",
		(e) => {
			if (shouldIgnoreShortcut(e) || hasBlockingModal()) return;
			if (rightTargetUid) {
				stepTo(rightTargetUid);
			}
		},
		{},
		[rightTargetUid, stepTo, downloadModalOpen, licenceModalOpen],
	);

	useHotkeys(
		"left, j",
		(e) => {
			if (shouldIgnoreShortcut(e) || hasBlockingModal()) return;
			if (leftTargetUid) {
				stepTo(leftTargetUid);
			}
		},
		{},
		[leftTargetUid, stepTo, downloadModalOpen, licenceModalOpen],
	);

	useHotkeys(
		"r",
		(e) => {
			if (shouldIgnoreShortcut(e) || hasBlockingModal() || decorationHidden) {
				return;
			}
			if (randomHandle) {
				saveNavContext(null);
				router.push(`/${randomHandle}`);
			}
		},
		{},
		[
			router,
			randomHandle,
			decorationHidden,
			downloadModalOpen,
			licenceModalOpen,
		],
	);

	useEffect(() => {
		if (!hasContext || !navContext?.href) return undefined;

		const onKeyDown = (e) => {
			if (e.key !== "Escape" || e.defaultPrevented || shouldIgnoreShortcut(e)) {
				return;
			}
			if (
				downloadModalOpen ||
				licenceModalOpen ||
				decorationHidden ||
				document.querySelector('[role="dialog"], [data-mobile-nav-open]')
			) {
				return;
			}
			e.preventDefault();
			prepareReturnToList();
			router.push(navContext.href);
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [
		hasContext,
		navContext?.href,
		downloadModalOpen,
		licenceModalOpen,
		decorationHidden,
		prepareReturnToList,
		router,
	]);

	return (
		<Fragment>
			<Head>
				<title>{pageTitle(title)}</title>
				<link rel="canonical" href={pageUrl} />
				<meta name="robots" content={robotsContent} />
				<meta name="description" content={description} />
				<meta key="og:title" property="og:title" content={title} />
				<meta property="og:type" content="article" />
				<meta property="og:description" content={description} />
				<meta property="og:image" content={socialImageUrl} />
				<meta property="og:image:alt" content={image.alt || title} />
				<meta property="og:url" content={pageUrl} />
				{publishedAt && (
					<meta property="article:published_time" content={publishedAt} />
				)}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={title} />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:image" content={socialImageUrl} />
				<meta name="twitter:image:alt" content={image.alt || title} />
			</Head>

			<JsonLd data={structuredData} />

			<Modal
				isOpen={downloadModalOpen}
				onClose={() => setDownloadModalOpen(false)}
			>
				<DownloadModal sketchplanationTitle={title} sketchplanationUid={uid} />
			</Modal>

			<Modal
				isOpen={licenceModalOpen}
				onClose={() => setLicenceModalOpen(false)}
			>
				<LicenceContent inline showSectionNav={false} />
			</Modal>

			<div className={styles.root}>
				<div className={styles.articleWrapper}>
					<article className={styles.article}>
						<div
							id="top"
							className={classNames(
								styles.title,
								hasContext && styles.titleWithNav,
								"scroll-mt-24",
							)}
						>
							{hasContext && (
								<SketchNavBar
									context={navContext}
									resolution={navResolution}
									onStep={persistStep}
									onReturnToList={prepareReturnToList}
								/>
							)}
							<TextHeader>{title}</TextHeader>
						</div>
						<div className={styles.image}>
							{image.dimensions.width < 790 && (
								<div className="absolute inset-0">
									<PrismicNextImage
										key={image.url}
										field={image}
										className="absolute inset-0 w-full h-full object-cover"
										width={100}
										height={100}
										imgixParams={{
											width: 100,
											blur: 100,
										}}
										priority={true}
									/>
									<div className="absolute inset-0 backdrop-blur-md backdrop-brightness-75" />
								</div>
							)}
							<SketchplanationImage
								image={image}
								title={title}
								priority={true}
								onPrevious={leftTargetUid ? () => stepTo(leftTargetUid) : null}
								onNext={rightTargetUid ? () => stepTo(rightTargetUid) : null}
								contextLabel={hasContext ? navContext.label : null}
							>
								<SketchplanationCtas
									key={uid}
									{...commonProps}
									variant="lightbox"
								/>
							</SketchplanationImage>
						</div>

						<div className={styles["ctas-area"]}>
							<SketchplanationCtas key={uid} {...commonProps} />
						</div>

						{/* <div className={styles["book-banner"]}>
							<BookBanner />
						</div> */}

						<div className={styles.main}>
							<div className="my-6">
								<SubscribeInline />
							</div>
							<div className={classNames(styles.body, "prose lg:prose-lg")}>
								<RichText field={body} />
							</div>
							{isPresent(topicTags) && (
								<nav className={styles.tags} aria-labelledby="filed-in-label">
									<span id="filed-in-label" className={styles["tags-label"]}>
										Filed in
									</span>
									{topicTags.map((tag) => {
										const slug = tag.uid || tag.slug;
										return (
											<Link
												key={tag.id}
												href={`/categories/${slug}`}
												className={styles.tag}
											>
												{humanizeTag(slug)}
											</Link>
										);
									})}
								</nav>
							)}
							<hr className={styles.divider} />
							<div className={styles["published-at"]}>
								<div>
									{publishedText !== "✨ Latest" && "Published "}
									<time dateTime={publishedAt}>{publishedText}</time>
								</div>
								<a
									href="#top"
									className={styles["back-to-top"]}
									onClick={(e) => {
										e.preventDefault();
										fastScrollToTop();
									}}
								>
									<ArrowUp size={14} strokeWidth={2} aria-hidden />
									Back to top
								</a>
							</div>
						</div>
						<aside className={styles.sidebar}>
							<div className={styles.cards}>
								<Cards />
							</div>

							<div className="md:sticky top-[40px]">
								{isPresent(similarSketchplanations) && (
									<div className={styles.related}>
										<SketchplanationsStack
											key={uid}
											title="Keep exploring"
											sketchplanations={similarSketchplanations}
											imageProps={{
												format: "auto",
												// Smallest to largest viewport
												sizes:
													"(max-width: 768px) calc(100vw - (var(--edgeInset) * 2)), (max-width: 1280px) calc(38vw - var(--gap) - (var(--edgeInset) * 2)), 26rem",
											}}
										/>
									</div>
								)}

								<div className="mt-10">
									<div className="flex gap-4">
										<div className="flex flex-row items-center gap-x-2">
											<KeyboardShortcut
												shortcut="←"
												icon={<ArrowLeft size={14} strokeWidth={1.5} />}
											/>
											{leftTargetUid ? (
												<FancyLink
													href={`/${leftTargetUid}`}
													onClick={
														hasContext
															? () => persistStep(leftTargetUid)
															: undefined
													}
												>
													<span className="flex flex-row items-center gap-x-1">
														<ChevronLeft
															size={16}
															className="pointerFine:hidden"
														/>
														{leftLabel}
													</span>
												</FancyLink>
											) : (
												<span
													className="flex flex-row items-center gap-x-1 text-textSubdued"
													aria-hidden="true"
												>
													<ChevronLeft
														size={16}
														className="pointerFine:hidden"
													/>
													{leftLabel}
												</span>
											)}
										</div>
										<div className="flex flex-row mx-auto items-center gap-x-2">
											<KeyboardShortcut shortcut="R" />
											{randomHandle ? (
												<FancyLink
													href={`/${randomHandle}`}
													onClick={() => saveNavContext(null)}
												>
													Random
												</FancyLink>
											) : (
												<span className="text-textSubdued" aria-hidden="true">
													Random
												</span>
											)}
										</div>
										<div className="flex flex-row items-center gap-x-2">
											{rightTargetUid ? (
												<FancyLink
													href={`/${rightTargetUid}`}
													onClick={
														hasContext
															? () => persistStep(rightTargetUid)
															: undefined
													}
												>
													<span className="flex flex-row items-center gap-x-1">
														{rightLabel}
														<ChevronRight
															size={16}
															className="pointerFine:hidden"
														/>
													</span>
												</FancyLink>
											) : (
												<span
													className="flex flex-row items-center gap-x-1 text-textSubdued"
													aria-hidden="true"
												>
													{rightLabel}
													<ChevronRight
														size={16}
														className="pointerFine:hidden"
													/>
												</span>
											)}
											<KeyboardShortcut
												shortcut="→"
												icon={<ArrowRight size={14} strokeWidth={1.5} />}
											/>
										</div>
									</div>
									<div className="text-center text-sm mt-12">
										When you buy through links on sketchplanations.com, I may
										earn an affiliate commission. Thanks for supporting the
										site!
										<br />
										<FancyLink href="/books">Browse all books</FancyLink>
									</div>
								</div>
							</div>
						</aside>
					</article>
				</div>

				<div className={styles.footer}>
					<TaggedSketchplanations key={uid} tags={tags} excludeUid={uid} />
				</div>
			</div>
		</Fragment>
	);
};

export async function getStaticProps({ params: { uid } }) {
	const sketchplanation = await client.getByUID("sketchplanation", uid);
	const tags = sketchplanation.data.tags;

	let { newerUid, olderUid, found } = chronologicalNeighbours(
		getCategoryNavData().recentUids,
		uid,
	);

	if (!found) {
		const [olderRes, newerRes] = await Promise.all([
			client.getByType("sketchplanation", {
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
			}),
			client.getByType("sketchplanation", {
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
			}),
		]);

		olderUid = olderRes?.results?.[0]?.uid || null;
		newerUid = newerRes?.results?.[0]?.uid || null;
	}

	const similarSketchplanations = shuffle(
		(
			await client.getByType("sketchplanation", {
				filters: [prismic.filter.similar(sketchplanation.id, 10)],
				pageSize: 6,
			})
		).results,
	);

	return {
		props: {
			sketchplanation,
			similarSketchplanations,
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
