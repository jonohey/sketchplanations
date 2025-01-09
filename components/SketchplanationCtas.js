import { track } from '@vercel/analytics';
import classNames from "classnames";
import { ExternalLink } from "lucide-react";
import { RoughNotation } from "react-rough-notation";
import styles from "./SketchplanationCtas.module.css";

const SketchplanationCtas = ({
	title,
	podcastLinkUrl,
	onDownload,
	redbubbleLinkUrl,
	onViewLicence,
	variant = "normal",
}) => {
	return (
		<ul
			className={classNames(
				styles.ctas,
				variant === "normal" && styles.ctasNormal,
				variant === "lightbox" && styles.ctasLightbox,
			)}
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
							)}
							href={podcastLinkUrl}
							target="_blank"
							rel="noreferrer"
							title={`Listen to ${title} in the podcast`}
							onClick={() => {
								track('Sketch-link-podcast-episode', { sketch: `${title}` });
							}}
						>
							Listen
							<ExternalLink size={16} />
						</a>
					</RoughNotation>
				</li>
			)}
			<li>
				<button
					className={classNames(
						styles.cta,
						variant === "normal" && styles.ctaNormal,
						variant === "lightbox" && styles.ctaLightbox,
					)}
					type="button"
					onClick={() => {
						track('Sketch-link-download', { sketch: `${title}` });
						onDownload();
					}}
				>
					Download
				</button>
			</li>
			{redbubbleLinkUrl && (
				<li>
					<a
						className={classNames(
							styles.cta,
							variant === "normal" && styles.ctaNormal,
							variant === "lightbox" && styles.ctaLightbox,
						)}
						href={redbubbleLinkUrl}
						target="_blank"
						rel="noreferrer"
						onClick={() => {
							track('Sketch-link-prints', { sketch: `${title}` });
						}}
					>
						Prints
						<ExternalLink size={16} />
					</a>
				</li>
			)}		
			<li>
				<button
					className={classNames(
						styles.cta,
						variant === "normal" && styles.ctaNormal,
						variant === "lightbox" && styles.ctaLightbox,
					)}
					type="button"
					onClick={() => {
						track('Sketch-link-licence', { sketch: `${title}` });
						onViewLicence();
					}}
				>
					Licence
				</button>
			</li>
		</ul>
	);
};

export default SketchplanationCtas;
