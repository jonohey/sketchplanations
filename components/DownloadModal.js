import { track } from "@vercel/analytics";
import { Download, ExternalLink } from "lucide-react";
import Link from 'next/link';

import styles from "./DownloadModal.module.css";

const DownloadModal = ({ sketchplanationUid, sketchplanationTitle }) => {
	return (
		<div>
			<h2 className={styles.header}>
				Download
			</h2>
			<div className={styles.main}>
				<div className="space-y-6">
					<div>
						<p className="mb-4">
							Here&apos;s a high resolution version of the sketch:
						</p>
						<button className="btn-primary inline-block hover:brightness-110 dark:hover:brightness-125 transition-all duration-200 transform hover:scale-105">
							<a
								href={`/api/dl?uid=${sketchplanationUid}`}
								download
								rel="noreferrer"
								target="_blank"
								className="flex items-center"
								onClick={() => {
									track('Downloaded-sketch', { sketch: `${sketchplanationTitle}` });
								}}
							>
								<Download size={18} className="mr-2" />
								Download {sketchplanationTitle}
							</a>
						</button>
						<p className="mb-2 mt-4">
							Enjoying the sketches?
						</p>
						<ul className="list-disc list-inside space-y-2 mb-2">
							<li>
								<Link
									href="/big-ideas-little-pictures"
									className="text-blue-600 hover:underline"
								>
									Get the book
								</Link>
							</li>
							<li>
								<Link
									href="/subscribe"
									className="text-blue-600 hover:underline"
									target="_blank"
									rel="noreferrer noopener"
								>
									Consider a paid subscription
								</Link>
							</li>
						</ul>
						<p>
							Commercial usage? Please see the{" "}
							<Link
								href="/licence"
								target="_blank"
								rel="noreferrer"
								className="text-blue-600 hover:underline"
							>
								licence
								<ExternalLink size={14} className="inline-block ml-1 mb-1" />
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DownloadModal;