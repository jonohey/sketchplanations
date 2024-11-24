import { track } from "@vercel/analytics";
import { Download, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

import styles from "./DownloadModal.module.css";
import SubscribeInline from "./SubscribeInline";

const DownloadModal = ({ sketchplanationUid, sketchplanationTitle }) => {
	const [subscribeInlineDoc, setSubscribeInlineDoc] = useState(null);
	
	useEffect(() => {
		fetch("/api/subscribeInlineDoc")
			.then((res) => res.json())
			.then(setSubscribeInlineDoc);
	}, []);
	
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
					</div>
					<div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
						<p className="mb-2">
							Enjoying the sketches?
						</p>
						<ul className="list-disc list-inside space-y-2 mb-2">
							<li>
								<a
									href="https://www.patreon.com/sketchplanations"
									target="_blank"
									rel="noreferrer"
									className="text-blue-600 hover:underline"
								>
									Support me on Patreon
									<ExternalLink size={14} className="inline-block ml-1 mb-1" />
								</a>
							</li>
							<li><a
									href="/big-ideas-little-pictures"
									className="text-blue-600 hover:underline"
								>
									Buy the book
								</a>
							</li>
							<li>or subscribe by email below</li>
						</ul>
						<p>
							Commercial usage? Please see the{" "}
							<a
								href="/licence"
								target="_blank"
								rel="noreferrer"
								className="text-blue-600 hover:underline"
							>
								licence
								<ExternalLink size={14} className="inline-block ml-1 mb-1" />
							</a>
						</p>
					</div>
					<SubscribeInline doc={subscribeInlineDoc} />
				</div>
			</div>
		</div>
	);
};

export default DownloadModal;