import { ExternalLink } from "lucide-react";
import styles from "./SketchplanationCtas.module.css";

const SketchplanationCtas = ({
	title,
	podcastLinkUrl,
	onDownload,
	redbubbleLinkUrl,
	onViewLicence,
}) => (
	<ul className={styles.ctas}>
		{podcastLinkUrl && (
			<li>
				<a
					className={styles.cta}
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
			<button className={styles.cta} type="button" onClick={onDownload}>
				Download
			</button>
		</li>
		{redbubbleLinkUrl && (
			<li>
				<a
					className={styles.cta}
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
			<button className={styles.cta} type="button" onClick={onViewLicence}>
				Licence
			</button>
		</li>
	</ul>
);

export default SketchplanationCtas;
