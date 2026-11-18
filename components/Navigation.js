import { track } from "@vercel/analytics";
import classNames from "classnames";
import { useRouter } from "next/router";

import styles from "./Navigation.module.css";

import {
	EXPLAINER_KIT_PATH,
	trackExplainerKitClick,
} from "helpers/explainerKit";

import Link from "./Link";

const Navigation = ({ kitPlacement = "desktop_nav" }) => {
	const router = useRouter();

	const isSelected = (path) => router.pathname === path;

	return (
		<nav className={styles.root}>
			<Link
				href="/"
				className={classNames(styles.item, styles["item--home"])}
				aria-current={isSelected("/") ? "page" : undefined}
			>
				Home
			</Link>
			<Link
				href="/search"
				className={classNames(styles.item, styles["item--home"])}
				aria-current={isSelected("/search") ? "page" : undefined}
			>
				Search
			</Link>
			<Link
				href="/categories"
				className={styles.item}
				aria-current={isSelected("/categories") ? "page" : undefined}
			>
				Categories
			</Link>
			<Link
				href="/big-ideas-little-pictures"
				className={styles.item}
				aria-current={
					isSelected("/big-ideas-little-pictures") ? "page" : undefined
				}
				onClick={() => {
					track("Book-page-link", { location: "header" });
				}}
			>
				Book
			</Link>
			<Link
				href={EXPLAINER_KIT_PATH}
				className={styles.item}
				aria-current={isSelected(EXPLAINER_KIT_PATH) ? "page" : undefined}
				onClick={() => trackExplainerKitClick(kitPlacement)}
			>
				Explainer Kit
			</Link>
			<a
				href="/subscribe"
				className={classNames(styles.item, styles["item--mobile-only"])}
				onClick={() => {
					track("Subscribe", { location: "header" });
				}}
			>
				<span className="inline-flex items-center gap-2">
					<span>Subscribe</span>
				</span>
			</a>
			<a
				href="https://podcast.sketchplanations.com"
				target="_blank"
				rel="noreferrer"
				className={styles.item}
				onClick={() => {
					track("Podcast-site-link", { location: "header" });
				}}
			>
				Podcast
			</a>
			<a
				href="https://www.redbubble.com/people/sketchplanator/explore?asc=u&page=1&sortOrder=top%20selling"
				target="_blank"
				rel="noreferrer"
				className={styles.item}
				onClick={() => {
					track("Shop", { location: "header" });
				}}
			>
				Prints
			</a>
			<Link
				href="/about"
				className={styles.item}
				aria-current={isSelected("/about") ? "page" : undefined}
			>
				About
			</Link>
		</nav>
	);
};

export default Navigation;
