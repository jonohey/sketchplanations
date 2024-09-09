import classNames from "classnames";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import styles from "./SocialSharing.module.css";

const buttons = [
	{
		id: "facebook",
		name: "Facebook",
		icon: (
			<path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
		),
		url({ url }) {
			return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
		},
	},
	{
		id: "twitter",
		name: "Twitter",
		icon: (
			<path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
		),
		url({ url, text }) {
			return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
		},
	},
	{
		id: "linkedin",
		name: "LinkedIn",
		icon: (
			<path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z" />
		),
		url({ url, title }) {
			return `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
		},
	},
	{
		id: "pinterest",
		name: "Pinterest",
		icon: (
			<path d="M12.14.5C5.86.5 2.7 5 2.7 8.75c0 2.27.86 4.3 2.7 5.05.3.12.57 0 .66-.33l.27-1.06c.1-.32.06-.44-.2-.73-.52-.62-.86-1.44-.86-2.6 0-3.33 2.5-6.32 6.5-6.32 3.55 0 5.5 2.17 5.5 5.07 0 3.8-1.7 7.02-4.2 7.02-1.37 0-2.4-1.14-2.07-2.54.4-1.68 1.16-3.48 1.16-4.7 0-1.07-.58-1.98-1.78-1.98-1.4 0-2.55 1.47-2.55 3.42 0 1.25.43 2.1.43 2.1l-1.7 7.2c-.5 2.13-.08 4.75-.04 5 .02.17.22.2.3.1.14-.18 1.82-2.26 2.4-4.33.16-.58.93-3.63.93-3.63.45.88 1.8 1.65 3.22 1.65 4.25 0 7.13-3.87 7.13-9.05C20.5 4.15 17.18.5 12.14.5z" />
		),
		url({ url, title }) {
			return `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(
				url,
			)}&description=${encodeURIComponent(title)}`;
		},
	},
];

const SocialSharing = ({ handle, title, text }) => {
	const [copied, setCopied] = useState(false);

	const sketchplanationUrl = `https://sketchplanations.com/${handle}`;

	const onCopy = () => {
		setCopied(true);
		setTimeout(() => setCopied(false), 3000);
	};

	return (
		<div className={styles["share-buttons"]}>
			{buttons.map(({ id, name, icon, url }) => (
				<a
					key={id}
					className={styles["share-button__link"]}
					href={url({ url: sketchplanationUrl, title, text })}
					target="_blank"
					rel="noreferrer"
					aria-label={`Share on ${name}`}
				>
					<div
						className={classNames(
							styles["share-button"],
							styles[`share-button--${id}`],
						)}
					>
						<div
							aria-hidden="true"
							className={classNames(
								styles["share-button__icon"],
								styles["share-button__icon--solid"],
							)}
						>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								{icon}
							</svg>
						</div>
						Share<span className="sr-only"> on {name}</span>
					</div>
				</a>
			))}
			<CopyToClipboard text={sketchplanationUrl} onCopy={onCopy}>
				<button className={styles["share-button__link"]} aria-label="Copy link">
					<div
						className={classNames(
							styles["share-button"],
							styles["share-button--copylink"],
						)}
					>
						<div
							aria-hidden="true"
							className={classNames(
								styles["share-button__icon"],
								styles["share-button__icon--solid"],
							)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
							>
								<path d="M13.723 18.654l-3.61 3.609c-2.316 2.315-6.063 2.315-8.378 0-1.12-1.118-1.735-2.606-1.735-4.188 0-1.582.615-3.07 1.734-4.189l4.866-4.865c2.355-2.355 6.114-2.262 8.377 0 .453.453.81.973 1.089 1.527l-1.593 1.592c-.18-.613-.5-1.189-.964-1.652-1.448-1.448-3.93-1.51-5.439-.001l-.001.002-4.867 4.865c-1.5 1.499-1.5 3.941 0 5.44 1.517 1.517 3.958 1.488 5.442 0l2.425-2.424c.993.284 1.791.335 2.654.284zm.161-16.918l-3.574 3.576c.847-.05 1.655 0 2.653.283l2.393-2.389c1.498-1.502 3.94-1.5 5.44-.001 1.517 1.518 1.486 3.959 0 5.442l-4.831 4.831-.003.002c-1.438 1.437-3.886 1.552-5.439-.002-.473-.474-.785-1.042-.956-1.643l-.084.068-1.517 1.515c.28.556.635 1.075 1.088 1.528 2.245 2.245 6.004 2.374 8.378 0l4.832-4.831c2.314-2.316 2.316-6.062-.001-8.377-2.317-2.321-6.067-2.313-8.379-.002z" />
							</svg>
						</div>
						{copied ? "Copied!" : "Copy link"}
					</div>
				</button>
			</CopyToClipboard>
		</div>
	);
};

export default SocialSharing;
