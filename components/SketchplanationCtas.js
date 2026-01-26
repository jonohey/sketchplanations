import { track } from '@vercel/analytics';
import classNames from "classnames";
import { Check, Copy, CreativeCommons, Download, Headphones, Link2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { RoughNotation } from "react-rough-notation";
import styles from "./SketchplanationCtas.module.css";

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

	return (
		<ul
			className={variant === "lightbox" ? styles.ctasLightbox : styles.ctas}
		>
			{podcastLinkUrl && (
				<li>
					<RoughNotation
						type="box"
						show={true}
						color="var(--color-brightRed)"
					>
						<a
							className={classNames(
								styles.cta,
								variant === "normal" && styles.ctaNormal,
								variant === "lightbox" && styles.ctaLightbox,
								variant === "lightbox" ? styles.ctaHoverLightbox : styles.ctaHover
							)}
							href={podcastLinkUrl}
							target="_blank"
							rel="noreferrer"
							title={`Listen to ${title} in the podcast`}
							onClick={() => {
								track('Sketch-link-podcast-episode', { sketch: `${title}` });
							}}
						>
							<span className="flex items-center gap-x-1">
								Listen
								<Headphones size={16} />
							</span>
						</a>
					</RoughNotation>
				</li>
			)}
		<li>
			<a
				className={classNames(
					styles.cta,
					variant === "normal" && styles.ctaNormal,
					variant === "lightbox" && styles.ctaLightbox,
					variant === "lightbox" ? styles.ctaHoverLightbox : styles.ctaHover
				)}
				href={`/api/dl?uid=${sketchplanationUid}`}
				download
				onClick={() => {
					track('Sketch-link-download', { sketch: `${title}` });
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
							variant === "lightbox" ? styles.ctaHoverLightbox : styles.ctaHover
						)}
						href={redbubbleLinkUrl}
						target="_blank"
						rel="noreferrer"
						onClick={() => {
							track('Sketch-link-prints', { sketch: `${title}` });
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
						variant === "lightbox" ? styles.ctaHoverLightbox : styles.ctaHover
					)}
					type="button"
					onClick={() => {
						track('Sketch-link-licence', { sketch: `${title}` });
						onViewLicence();
					}}
				>
					<span className="flex items-center gap-x-1">
						Licence
						<CreativeCommons size={16} />
					</span>
				</button>
			</li>
			<li className="relative">
				<div 
					className={classNames(
						"absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-gray-900 text-white text-sm transition-all duration-200",
						copied ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-1 invisible pointer-events-none"
					)}
				>
					Copied!
				</div>
				<button
					className={classNames(
						styles.cta,
						variant === "normal" && styles.ctaNormal,
						variant === "lightbox" && styles.ctaLightbox,
						variant === "lightbox" ? styles.copyButtonLightbox : styles.copyButton,
						styles.copyButtonHover,
						"group"
					)}
					type="button"
					onClick={() => {
						const url = window.location.href;
						navigator.clipboard.writeText(url).then(() => {
							setCopied(true);
							track('Sketch-link-copy', { sketch: `${title}` });
							
							setTimeout(() => {
								setCopied(false);
							}, 2000);
						});
					}}
				>
					<span className="flex items-center gap-x-1">
						Copy link
						{copied ? (
							<Check size={16} className="text-green-500 transition-all duration-200" />
						) : (
							<span className="relative w-4 h-4">
								<Link2 
									size={16} 
									className={classNames(
										"absolute top-0 left-0",
										"group-hover:invisible"
									)} 
								/>
								<Copy 
									size={16} 
									className={classNames(
										"absolute top-0 left-0",
										"opacity-0 -translate-y-2 invisible",
										"group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible group-hover:transition-all group-hover:duration-75"
									)} 
								/> 
							</span>
						)}
					</span>
				</button>
			</li>
		</ul>
	);
};

export default SketchplanationCtas;
