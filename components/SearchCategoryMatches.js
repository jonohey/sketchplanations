import { Tag } from "lucide-react";
import Link from "next/link";

import styles from "./SearchCategoryMatches.module.css";

const SearchCategoryMatches = ({ categories }) => {
	if (!categories?.length) return null;

	return (
		<div className={styles.root}>
			<p className={styles.label}>
				<Tag size={14} strokeWidth={1.5} aria-hidden />
				Categories
			</p>
			{categories.map(({ id, slugs, data: { identifier, count } }) => (
				<Link
					key={id}
					href={`/categories/${slugs[0]}`}
					className={styles.pill}
				>
					{identifier}
					{count > 0 && <span className={styles.count}>({count})</span>}
				</Link>
			))}
			<Link href="/categories" className={styles["all-categories"]}>
				All categories →
			</Link>
		</div>
	);
};

export default SearchCategoryMatches;
