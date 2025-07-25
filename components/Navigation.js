import { track } from '@vercel/analytics';
import classNames from "classnames";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/router";
import { RoughNotation } from "react-rough-notation";
import Link from "./Link";

import styles from "./Navigation.module.css";

const roughNotationProps = {
	iterations: 1,
	animationDuration: 200,
	animationDelay: 50,
	padding: 3,
	type: "underline",
};

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
				<RoughNotation show={isSelected("/")} {...roughNotationProps}>
					Home
				</RoughNotation>
			</Link>
			<Link
				href="/search"
				className={classNames(styles.item, styles["item--home"])}
				aria-current={isSelected("/search") ? "page" : undefined}
			>
				<RoughNotation show={isSelected("/search")} {...roughNotationProps}>
					Search
				</RoughNotation>
			</Link>
			<Link
				href="/categories"
				className={styles.item}
				aria-current={isSelected("/categories") ? "page" : undefined}
			>
				<RoughNotation show={isSelected("/categories")} {...roughNotationProps}>
					Categories
				</RoughNotation>
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
				<RoughNotation
					show={isSelected("/big-ideas-little-pictures")}
					{...roughNotationProps}
				>
					Book!
				</RoughNotation>
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
				<span className="inline-flex items-center gap-2">
					<span>Podcast</span>
					<ExternalLink size={16} className="inline" />
				</span>
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
				<span className="inline-flex items-center gap-2">
					<span>Shop</span>
					<ExternalLink size={16} className="inline" />
				</span>
			</a>
			<Link
				href="/about"
				className={styles.item}
				aria-current={isSelected("/about") ? "page" : undefined}
			>
				<RoughNotation show={isSelected("/about")} {...roughNotationProps}>
					About
				</RoughNotation>
			</Link>
		</nav>
	);
};

export default Navigation;
