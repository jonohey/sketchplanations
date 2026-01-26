import { track } from "@vercel/analytics";
import { Smile, SquareCheckBig } from "lucide-react";
import Link from 'next/link';

import styles from "./DownloadModal.module.css";

const DownloadModal = ({ sketchplanationTitle }) => {
	return (
		<div>
			<h2 className={styles.header}>
				<SquareCheckBig size={24} className="inline-block mr-2" />
				Download started
			</h2>
			<div className={styles.main}>
				<div className="space-y-6">
					<div>
						<p className="mb-4">
							A high-resolution file for <strong>{sketchplanationTitle}</strong> is on its way. Please check your downloads.
						</p>
						<p className="mb-2">
							<Smile size={16} className="inline-block mr-1 -mt-1" />
							Enjoying the sketches?
						</p>
						<ul className="list-disc list-inside space-y-2 mb-2">
							<li>
								<a
									href="https://buymeacoffee.com/sketchplanator"
									className="text-blue-600 hover:underline"
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
									className="text-blue-600 hover:underline"
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
									className="text-blue-600 hover:underline"
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
						<p>
							Commercial usage? Please see the{" "}
							<Link
								href="/licence"
								target="_blank"
								rel="noreferrer"
								className="text-blue-600 hover:underline"
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
		</div>
	);
};

export default DownloadModal;