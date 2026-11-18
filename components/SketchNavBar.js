import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import styles from "./SketchNavBar.module.css";

import KeyboardShortcut from "./KeyboardShortcut";

export default function SketchNavBar({
	leftHref = null,
	rightHref = null,
	leftLabel = "Newer",
	rightLabel = "Older",
	context = null,
	resolution = null,
	onStepLeft,
	onStepRight,
	onReturnToList,
}) {
	const hasContext = Boolean(context && resolution);
	const position = resolution?.position;
	const total = resolution?.total;

	return (
		<nav
			aria-label={hasContext ? "Collection navigation" : "Sketch navigation"}
			className={styles.root}
			data-testid="sketch-nav-bar"
		>
			{leftHref ? (
				<Link
					href={leftHref}
					onClick={onStepLeft}
					className={styles.stepLink}
					aria-label={
						hasContext ? `${leftLabel} in ${context.label}` : leftLabel
					}
					data-testid="sketch-nav-previous"
				>
					<KeyboardShortcut
						shortcut="←"
						icon={<ArrowLeft size={14} strokeWidth={1.5} />}
					/>
					<span className={styles.stepLabel}>
						<ChevronLeft
							size={16}
							className={styles.touchChevron}
							aria-hidden="true"
						/>
						{leftLabel}
					</span>
				</Link>
			) : (
				<span
					className={styles.stepDisabled}
					aria-disabled="true"
					data-testid="sketch-nav-previous-disabled"
				>
					<KeyboardShortcut
						shortcut="←"
						icon={<ArrowLeft size={14} strokeWidth={1.5} />}
					/>
					<span className={styles.stepLabelDisabled}>
						<ChevronLeft
							size={16}
							className={styles.touchChevron}
							aria-hidden="true"
						/>
						{leftLabel}
					</span>
				</span>
			)}

			<div className={styles.context} data-testid="sketch-nav-context">
				{hasContext && (
					<>
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
					</>
				)}
			</div>

			{rightHref ? (
				<Link
					href={rightHref}
					onClick={onStepRight}
					className={styles.stepLink}
					aria-label={
						hasContext ? `${rightLabel} in ${context.label}` : rightLabel
					}
					data-testid="sketch-nav-next"
				>
					<span className={styles.stepLabel}>
						{rightLabel}
						<ChevronRight
							size={16}
							className={styles.touchChevron}
							aria-hidden="true"
						/>
					</span>
					<KeyboardShortcut
						shortcut="→"
						icon={<ArrowRight size={14} strokeWidth={1.5} />}
					/>
				</Link>
			) : (
				<span
					className={styles.stepDisabled}
					aria-disabled="true"
					data-testid="sketch-nav-next-disabled"
				>
					<span className={styles.stepLabelDisabled}>
						{rightLabel}
						<ChevronRight
							size={16}
							className={styles.touchChevron}
							aria-hidden="true"
						/>
					</span>
					<KeyboardShortcut
						shortcut="→"
						icon={<ArrowRight size={14} strokeWidth={1.5} />}
					/>
				</span>
			)}
		</nav>
	);
}
