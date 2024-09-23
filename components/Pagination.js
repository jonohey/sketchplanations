import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Fragment } from "react";
import FancyLink from "./FancyLink";
import styles from "./Pagination.module.css";

const commonIconProps = {
	color: "var(--color-blue)",
	size: 16,
};

const Pagination = ({ currentPage, totalPages, className }) => {
	const pageNumbers = getPageNumbers(currentPage, totalPages);

	return (
		<div className={classNames(styles.root, className)}>
			<div className={styles.ident}>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/logo.svg"
					className={styles.ident__svg}
					alt="Sketchplanations"
				/>
			</div>
			<nav className={styles.pagination}>
				{currentPage > 1 && (
					<FancyLink
						href={currentPage <= 1 ? "/" : `/?page=${currentPage - 1}`}
						aria-label="Previous page"
					>
						<span className={styles.navButton}>
							<ChevronLeft {...commonIconProps} />
							Previous
						</span>
					</FancyLink>
				)}

				{pageNumbers.map((pageNumber) => (
					<Fragment key={pageNumber}>
						{pageNumber === "…" ? (
							<span className={styles.ellipsis}>…</span>
						) : (
							<FancyLink
								href={pageNumber === 1 ? "/" : `/?page=${pageNumber}`}
								className={`${styles.pageLink} ${pageNumber === currentPage ? styles.active : ""}`}
								active={pageNumber === currentPage}
							>
								{pageNumber}
							</FancyLink>
						)}
					</Fragment>
				))}

				{currentPage < totalPages && (
					<FancyLink
						href={`/?page=${currentPage + 1}`}
						aria-label="Next page"
						aria-disabled={currentPage >= totalPages}
					>
						<span className={styles.navButton}>
							Next
							<ChevronRight {...commonIconProps} />
						</span>
					</FancyLink>
				)}
			</nav>

			<div className="text-center mt-8">
				<FancyLink href="/search" className={styles.footerLink}>
					Search
				</FancyLink>
				<span className="mx-2">·</span>
				<FancyLink href="/categories" className={styles.footerLink}>
					Categories
				</FancyLink>
				<span className="mx-2">·</span>
				<FancyLink href="/archive" className={styles.footerLink}>
					Archive
				</FancyLink>
			</div>
		</div>
	);
};

function getPageNumbers(currentPage, totalPages) {
	const pageNumbers = [];
	const maxVisiblePages = 10;

	if (totalPages <= maxVisiblePages) {
		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(i);
		}
	} else {
		pageNumbers.push(1);

		if (currentPage > 4) {
			pageNumbers.push("…");
		}

		const start = Math.max(2, currentPage - 2);
		const end = Math.min(totalPages - 1, currentPage + 2);

		for (let i = start; i <= end; i++) {
			pageNumbers.push(i);
		}

		if (currentPage < totalPages - 3) {
			pageNumbers.push("…");
		}
	}

	return pageNumbers;
}

export default Pagination;
