"use client";

import { fastScrollToTop } from "helpers";

const BackToTop = ({ className = "mt-4" }) => (
	<p className={className}>
		<a
			href="#top"
			className="inline-block text-sm text-blue hover:underline"
			onClick={(event) => {
				event.preventDefault();
				fastScrollToTop();
			}}
		>
			Back to top ↑
		</a>
	</p>
);

export default BackToTop;
