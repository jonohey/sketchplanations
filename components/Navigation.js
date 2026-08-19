import { track } from '@vercel/analytics';
import classNames from "classnames";
import { useRouter } from "next/router";
import Link from "./Link";

import styles from "./Navigation.module.css";

const Navigation = () => {
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
					track('Book-page-link', { location: 'header' });
				}}
			>
				Book!
			</Link>
			<a
				href="https://sketchplanations.substack.com/subscribe"
				target="_blank"
				rel="noopener noreferrer"
				className={styles.item}
				onClick={() => {
					track('Subscribe', { location: 'header' });
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
					track('Podcast-site-link', { location: 'header' });
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
					track('Shop', { location: 'header' });
				}}
			>
				Shop
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
