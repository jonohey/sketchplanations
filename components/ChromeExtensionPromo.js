import { track } from "@vercel/analytics";
import useIsChromeDesktop from "hooks/useIsChromeDesktop";
import chromeWebStoreBadge from "images/chrome-web-store-badge.png";
import Image from "next/image";

const ChromeExtensionPromo = () => {
	const isChromeDesktop = useIsChromeDesktop();

	// Prevent layout shift: return null during SSR and initial render
	// Also return null if not Chrome desktop (no empty space)
	if (isChromeDesktop === null || !isChromeDesktop) {
		return null;
	}

	return (
		<div className="my-6 py-4 px-4 bg-bgHighlight rounded-lg border border-border">
			<a
				href="https://chromewebstore.google.com/detail/sketchplanations-new-tab/noghagedafbhdmjgageamipnnpbjnppa"
				target="_blank"
				rel="noopener noreferrer"
				onClick={() => {
					track("Extension-link", { location: "about-page", source: "badge" });
				}}
				className="dark:bg-white dark:rounded inline-block mb-3 m-0 p-0"
			>
				<Image
					src={chromeWebStoreBadge}
					alt="Available in the Chrome Web Store"
					width={206}
					height={58}
					className="m-0 p-0"
				/>
			</a>
			<div className="prose max-w-none">
				<p className="mb-2">
					<strong>Try the Chrome Extension</strong>
				</p>
				<p className="mb-0">
					See a Sketchplanation on your new tab page. A lightweight, ad-free, way to
					discover and learn ideas throughout your day.{" "}
					<a
						href="https://chromewebstore.google.com/detail/sketchplanations-new-tab/noghagedafbhdmjgageamipnnpbjnppa"
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue"
						onClick={() => {
							track("Extension-link", { location: "about-page" });
						}}
					>
						Install from Chrome Web Store
					</a>
				</p>
			</div>
		</div>
	);
};

export default ChromeExtensionPromo;
