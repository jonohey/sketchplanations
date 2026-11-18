import { saveNavContext } from "helpers/navContext";

const isPlainPrimaryClick = (event) =>
	event.button === 0 &&
	!event.metaKey &&
	!event.ctrlKey &&
	!event.shiftKey &&
	!event.altKey;

export default function NavContextScope({
	context = null,
	className,
	children,
}) {
	return (
		<div
			className={className}
			onClickCapture={(event) => {
				if (!(event.target instanceof Element)) return;
				const card = event.target.closest("a[data-sketch-card]");
				if (!card) return;

				// Don't wipe the current tab's browsing context if someone opens an
				// unrelated card in a background tab.
				if (context === null && !isPlainPrimaryClick(event)) return;

				const uid = card.getAttribute("data-sketch-uid") || undefined;
				saveNavContext(
					context && uid ? { ...context, lastViewedUid: uid } : context,
				);
			}}
		>
			{children}
		</div>
	);
}
