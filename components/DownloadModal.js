import { track } from "@vercel/analytics";
import classNames from "classnames";
import { ChevronDown, Download, Smile, SquareCheckBig } from "lucide-react";
import Link from 'next/link';
import { useState } from "react";

import styles from "./DownloadModal.module.css";

const STRIPE_SUPPORT_10 = "https://buy.stripe.com/5kQ7sL1yZaA6dbX57x1Fe02";
const STRIPE_SUPPORT_20 = "https://buy.stripe.com/8x27sLcdDaA67RD57x1Fe03";
const STRIPE_SUPPORT_OTHER = "https://buy.stripe.com/4gMcN57XngYu3Bn6bB1Fe04";

const DownloadModal = ({ sketchplanationTitle, sketchplanationUid }) => {
	const [highResOpen, setHighResOpen] = useState(false);

	return (
		<div>
			<h2 className={styles.header}>
				<SquareCheckBig size={24} className="inline-block mr-2" />
				Download started
			</h2>
			<div className={styles.main}>
				<div className="space-y-6">
					<p>A sharing-ready image is downloading. Check your downloads folder.</p>

					<div className={styles.highResWrapper}>
						<button
							type="button"
							className={styles.highResTrigger}
							aria-expanded={highResOpen}
							aria-controls="high-res-content"
							onClick={() => {
								if (!highResOpen) {
									track('expand_high_res', { sketch: sketchplanationTitle });
								}
								setHighResOpen(!highResOpen);
							}}
						>
							Need a high-resolution file?
							<ChevronDown
								size={18}
								className={classNames(
									styles.highResTriggerIcon,
									highResOpen && styles.highResTriggerIconOpen
								)}
							/>
						</button>

						{highResOpen && (
							<div id="high-res-content" className={styles.highResSection}>
								<p>
									If it's useful to you, please consider supporting my work.
								</p>
								<div className={styles.supportButtons}>
									<a
										href={STRIPE_SUPPORT_10}
										target="_blank"
										rel="noopener noreferrer"
										className="btn-primary"
										aria-label="Support with £10"
										onClick={() => {
											track('support_10', { sketch: sketchplanationTitle, location: 'download-modal' });
										}}
									>
										£10
									</a>
									<a
										href={STRIPE_SUPPORT_20}
										target="_blank"
										rel="noopener noreferrer"
										className="btn-primary"
										aria-label="Support with £20"
										onClick={() => {
											track('support_20', { sketch: sketchplanationTitle, location: 'download-modal' });
										}}
									>
										£20
									</a>
									<a
										href={STRIPE_SUPPORT_OTHER}
										target="_blank"
										rel="noopener noreferrer"
										className="btn-primary"
										aria-label="Support with a custom amount"
										onClick={() => {
											track('support_other', { sketch: sketchplanationTitle, location: 'download-modal' });
										}}
									>
										Other
									</a>
								</div>

								<a
									href={`/api/dl?uid=${sketchplanationUid}`}
									download
									className={styles.highResCta}
									onClick={() => {
										track('download_high_res', { sketch: sketchplanationTitle });
									}}
								>
									<Download size={16} />
									Download high-resolution
								</a>
							</div>
						)}
					</div>

					<div>
						<p className="mb-2">
							<Smile size={16} className="inline-block mr-1 -mt-1" />
							Enjoying the sketches?
						</p>
						<ul className="list-disc list-inside space-y-2 mb-2">
							<li>
								<a
									href="https://buymeacoffee.com/sketchplanator"
									target="_blank"
									rel="noreferrer noopener"
									onClick={() => {
										track('Buy-me-a-coffee', { location: 'download-modal', sketch: sketchplanationTitle });
									}}
								>
									Buy Me a Coffee
								</a>
							</li>
							<li>
								<Link
									href="/big-ideas-little-pictures"
									target="_blank"
									onClick={() => {
										track('Book-page-link', { location: 'download-modal', sketch: sketchplanationTitle });
									}}
								>
									Get the book
								</Link>
							</li>
							<li>
								<Link
									href="/subscribe"
									target="_blank"
									rel="noreferrer noopener"
									onClick={() => {
										track('Subscribe', { location: 'download-modal', sketch: sketchplanationTitle });
									}}
								>
									Consider a paid subscription
								</Link>
							</li>
						</ul>
					</div>

					<p>
						Commercial usage? Please see the{" "}
						<Link
							href="/licence"
							target="_blank"
							rel="noreferrer"
							onClick={() => {
								track('Licence-page-link', { location: 'download-modal', sketch: sketchplanationTitle });
							}}
						>
							licence
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default DownloadModal;
