import { ExternalLink } from "lucide-react";
import styles from "./SketchplanationCtas.module.css";
import classNames from "classnames";

const SketchplanationCtas = ({
	title,
	podcastLinkUrl,
	onDownload,
	redbubbleLinkUrl,
	onViewLicence,
	variant = "normal",
}) => (
	<ul
		className={classNames(
			styles.ctas,
			variant === "normal" && styles.ctasNormal,
			variant === "lightbox" && styles.ctasLightbox,
		)}
	>
		{podcastLinkUrl && (
			<li>
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
				>
					Listen
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
				onClick={onDownload}
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
				onClick={onViewLicence}
			>
				Licence
			</button>
		</li>
	</ul>
);

export default SketchplanationCtas;
