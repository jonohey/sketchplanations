import {
	flip,
	offset,
	shift,
	useDismiss,
	useFloating,
	useFocus,
	useHover,
	useInteractions,
	useRole,
} from "@floating-ui/react";
import { track } from "@vercel/analytics";
import classNames from "classnames";
import {
	Check,
	Copy,
	CreativeCommons,
	Download,
	Headphones,
	Link2,
	ShoppingCart,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import styles from "./SketchplanationCtas.module.css";

import { capturePostHogEvent } from "helpers/posthog";
import shouldIgnoreShortcut from "helpers/shouldIgnoreShortcut";

const SketchplanationCtas = ({
	title,
	podcastLinkUrl,
	onDownload,
	redbubbleLinkUrl,
	onViewLicence,
	sketchplanationUid,
	variant = "normal",
}) => {
	const [copied, setCopied] = useState(false);
	const [hintOpen, setHintOpen] = useState(false);
	const copiedTimeoutRef = useRef(null);

	useEffect(() => () => clearTimeout(copiedTimeoutRef.current), []);

	// The tooltip also stays up briefly after copying, so it doubles as the
	// "Link copied!" confirmation when the link is copied with the keyboard.
	const { refs, floatingStyles, context } = useFloating({
		open: hintOpen || copied,
		onOpenChange: setHintOpen,
		placement: "top",
		middleware: [offset(8), flip(), shift({ padding: 8 })],
	});
	const { getReferenceProps, getFloatingProps } = useInteractions([
		useHover(context, { move: false, delay: { open: 300, close: 0 } }),
		useFocus(context, { visibleOnly: true }),
		useDismiss(context),
		useRole(context, { role: "tooltip" }),
	]);

	const copyLink = useCallback(() => {
		navigator.clipboard
			.writeText(window.location.href)
			.then(() => {
				setCopied(true);
				track("Sketch-link-copy", { sketch: `${title}` });
				capturePostHogEvent("sketch_link_copied", {
					sketch_uid: sketchplanationUid,
					surface: variant,
				});

				clearTimeout(copiedTimeoutRef.current);
				copiedTimeoutRef.current = setTimeout(() => {
					setCopied(false);
				}, 2000);
			})
			.catch(() => {});
	}, [title, sketchplanationUid, variant]);

	// Both variants can be mounted at once (the lightbox one sits on top), so
	// only the topmost instance responds to the shortcut.
	useHotkeys(
		"c",
		(e) => {
			if (shouldIgnoreShortcut(e)) return;
			if (
				variant === "normal" &&
				document.querySelector('[data-sketch-ctas="lightbox"]')
			) {
				return;
			}
			// Ignore other modals (download, licence), but not the image
			// lightbox that these buttons belong to.
			const otherDialogOpen = [
				...document.querySelectorAll('[role="dialog"]'),
			].some(
				(dialog) =>
					!dialog.getAttribute("aria-label")?.endsWith("zoomable image"),
			);
			if (otherDialogOpen) return;
			if (document.querySelector("[data-mobile-nav-open]")) return;
			copyLink();
		},
		{},
		[variant, copyLink],
	);

	return (
		<ul
			data-sketch-ctas={variant}
			className={variant === "lightbox" ? styles.ctasLightbox : styles.ctas}
		>
			{podcastLinkUrl && (
				<li>
					<a
						className={classNames(
							styles.cta,
							styles.ctaListen,
							variant === "normal" && styles.ctaNormal,
							variant === "lightbox" && styles.ctaLightbox,
							variant === "lightbox"
								? styles.ctaHoverLightbox
								: styles.ctaHover,
						)}
						href={podcastLinkUrl}
						target="_blank"
						rel="noreferrer"
						title={`Listen to ${title} in the podcast`}
						onClick={() => {
							track("Sketch-link-podcast-episode", { sketch: `${title}` });
							capturePostHogEvent("podcast_episode_opened", {
								sketch_uid: sketchplanationUid,
								surface: variant,
							});
						}}
					>
						<span className="flex items-center gap-x-1">
							Listen
							<Headphones size={16} />
						</span>
					</a>
				</li>
			)}
			<li>
				<a
					className={classNames(
						styles.cta,
						variant === "normal" && styles.ctaNormal,
						variant === "lightbox" && styles.ctaLightbox,
						variant === "lightbox" ? styles.ctaHoverLightbox : styles.ctaHover,
					)}
					href={`/api/dl?uid=${sketchplanationUid}&format=medium`}
					download
					onClick={() => {
						track("Sketch-link-download", { sketch: `${title}` });
						capturePostHogEvent("sketch_download_requested", {
							download_format: "medium",
							sketch_uid: sketchplanationUid,
							surface: variant,
						});
						onDownload();
					}}
				>
					<span className="flex items-center gap-x-1">
						Download
						<Download size={16} />
					</span>
				</a>
			</li>
			{redbubbleLinkUrl && (
				<li>
					<a
						className={classNames(
							styles.cta,
							variant === "normal" && styles.ctaNormal,
							variant === "lightbox" && styles.ctaLightbox,
							variant === "lightbox"
								? styles.ctaHoverLightbox
								: styles.ctaHover,
						)}
						href={redbubbleLinkUrl}
						target="_blank"
						rel="noreferrer"
						onClick={() => {
							track("Sketch-link-prints", { sketch: `${title}` });
							capturePostHogEvent("sketch_prints_opened", {
								sketch_uid: sketchplanationUid,
								surface: variant,
							});
						}}
					>
						<span className="flex items-center gap-x-1">
							Prints
							<ShoppingCart size={16} />
						</span>
					</a>
				</li>
			)}
			<li>
				<button
					className={classNames(
						styles.cta,
						variant === "normal" && styles.ctaNormal,
						variant === "lightbox" && styles.ctaLightbox,
						variant === "lightbox" ? styles.ctaHoverLightbox : styles.ctaHover,
					)}
					type="button"
					onClick={() => {
						track("Sketch-link-licence", { sketch: `${title}` });
						capturePostHogEvent("sketch_licence_viewed", {
							sketch_uid: sketchplanationUid,
							surface: variant,
						});
						onViewLicence();
					}}
				>
					<span className="flex items-center gap-x-1">
						Licence
						<CreativeCommons size={16} />
					</span>
				</button>
			</li>
			<li>
				<button
					ref={refs.setReference}
					{...getReferenceProps()}
					className={classNames(
						styles.cta,
						variant === "normal" && styles.ctaNormal,
						variant === "lightbox" && styles.ctaLightbox,
						variant === "lightbox"
							? styles.copyButtonLightbox
							: styles.copyButton,
						styles.copyButtonHover,
						"group",
					)}
					type="button"
					aria-keyshortcuts="C"
					onClick={copyLink}
				>
					<span className="flex items-center gap-x-1">
						Copy link
						{copied ? (
							<Check
								size={16}
								className="text-green-500 transition-all duration-200"
							/>
						) : (
							<span className="relative w-4 h-4">
								<Link2
									size={16}
									className={classNames(
										"absolute top-0 left-0",
										"group-hover:invisible",
									)}
								/>
								<Copy
									size={16}
									className={classNames(
										"absolute top-0 left-0",
										"opacity-0 -translate-y-2 invisible",
										"group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible group-hover:transition-all group-hover:duration-75",
									)}
								/>
							</span>
						)}
					</span>
				</button>
				<span role="status" className="sr-only">
					{copied ? "Link copied" : ""}
				</span>
				{(hintOpen || copied) && (
					<div
						ref={refs.setFloating}
						style={floatingStyles}
						{...getFloatingProps()}
						className="z-50 flex items-center gap-x-2 px-2 py-1 rounded bg-gray-900 text-white text-sm font-normal whitespace-nowrap pointer-events-none"
					>
						{copied ? (
							"Link copied!"
						) : (
							<>
								Copy link
								<kbd className="px-1.5 rounded border border-white/40 text-xs font-sans">
									C
								</kbd>
							</>
						)}
					</div>
				)}
			</li>
		</ul>
	);
};

export default SketchplanationCtas;
