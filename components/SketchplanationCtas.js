import { track } from '@vercel/analytics';
import classNames from "classnames";
import { ExternalLink } from "lucide-react";
import { useCallback, useEffect, useRef } from 'react';
import styles from "./SketchplanationCtas.module.css";

import { annotate } from 'rough-notation';


const SketchplanationCtas = ({
	title,
	podcastLinkUrl,
	onDownload,
	redbubbleLinkUrl,
	onViewLicence,
	variant = "normal",
}) => {
	const podcastLinkRef = useRef(null);

	const createAnnotation = useCallback(() => {
		if (podcastLinkRef.current) {
			const annotation = annotate(podcastLinkRef.current, { 
				type: 'box', 
				color: 'var(--color-brightRed)' 
			});
			annotation.show();
		}
	}, []);

	useEffect(() => {
		createAnnotation();
	}, [createAnnotation]);

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
					<a
						ref={podcastLinkRef}
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
