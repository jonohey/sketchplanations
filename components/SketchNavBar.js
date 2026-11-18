import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import styles from "./SketchNavBar.module.css";

export default function SketchNavBar({
	context,
	resolution,
	onStep,
	onReturnToList,
}) {
	if (!context || !resolution) return null;

	const { previous, next, position, total } = resolution;

	return (
		<nav
			aria-label="Collection navigation"
			className={styles.root}
			data-testid="sketch-nav-bar"
		>
			{previous ? (
				<Link
					href={`/${previous}`}
					onClick={() => onStep?.(previous)}
					className={styles.stepLink}
					aria-label={`Previous in ${context.label}`}
					data-testid="sketch-nav-previous"
				>
					<ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
					<span>Prev</span>
				</Link>
			) : (
				<span
					className={styles.stepDisabled}
					aria-disabled="true"
					data-testid="sketch-nav-previous-disabled"
				>
					<ChevronLeft size={16} strokeWidth={2} aria-hidden="true" />
					<span>Prev</span>
				</span>
			)}

			<div className={styles.context} data-testid="sketch-nav-context">
				<Link
					href={context.href}
					onClick={onReturnToList}
					className={styles.contextLink}
					title={context.label}
				>
					<span className={styles.contextLabel}>{context.label}</span>
				</Link>
				{total > 1 && (
					<span
						className={styles.position}
						aria-label={`Sketch ${position} of ${total}`}
					>
						<span aria-hidden="true" className={styles.dot}>
							·
						</span>
						<span>
							{position} of {total}
						</span>
					</span>
				)}
			</div>

			{next ? (
				<Link
					href={`/${next}`}
					onClick={() => onStep?.(next)}
					className={styles.stepLink}
					aria-label={`Next in ${context.label}`}
					data-testid="sketch-nav-next"
				>
					<span>Next</span>
					<ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
				</Link>
			) : (
				<span
					className={styles.stepDisabled}
					aria-disabled="true"
					data-testid="sketch-nav-next-disabled"
				>
					<span>Next</span>
					<ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
				</span>
			)}
		</nav>
	);
}
