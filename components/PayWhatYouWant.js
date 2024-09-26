import { track } from "@vercel/analytics";
import { Download, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

import styles from "./PayWhatYouWant.module.css";
import SubscribeInline from "./SubscribeInline";

const PayWhatYouWant = ({ sketchplanationUid, sketchplanationTitle }) => {
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
						<p>
							Enjoying the sketches?&nbsp;
							<a
								href="https://www.patreon.com/sketchplanations"
								target="_blank"
								rel="noreferrer"
								className="text-blue-600 hover:underline"
							>
								Support me on Patreon
								<ExternalLink size={14} className="inline-block ml-1 mb-1" />
							</a>
							&nbsp;or subscribe by email below
						</p>
					</div>
					<SubscribeInline doc={subscribeInlineDoc} />
				</div>
			</div>
		</div>
	);
};

export default PayWhatYouWant;