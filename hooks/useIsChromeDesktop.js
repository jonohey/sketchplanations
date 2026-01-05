import { useEffect, useState } from "react";

const useIsChromeDesktop = () => {
	const [isChromeDesktop, setIsChromeDesktop] = useState(null);

	useEffect(() => {
		// Only run on client side
		if (typeof window === "undefined") {
			return;
		}

		// Check if desktop using pointer: fine media query (aligns with codebase pattern)
		const pointerFineQuery = window.matchMedia("(pointer: fine)");
		const isDesktop = pointerFineQuery.matches;

		// Check if Chrome browser (not Edge, Brave, ChatGPT Atlas, or other Chromium browsers)
		const userAgent = navigator.userAgent;

		// Exclude known Chromium-based browsers that aren't Google Chrome
		// Check for Brave browser (multiple methods for reliability)
		const isBrave =
			typeof navigator.brave !== "undefined" ||
			(navigator.userAgentData?.brands?.some(
				(brand) => brand.brand === "Brave",
			) ??
				false) ||
			/Brave/i.test(userAgent);

		// Check for ChatGPT Atlas (basic check - may not catch all cases)
		const isAtlas = /ChatGPT-Atlas/i.test(userAgent);

		// Check for Edge
		const isEdge = userAgent.includes("Edg");

		// Check for other known Chromium browsers
		const isOtherChromium =
			/Opera|OPR|Vivaldi|Yandex|Chromium/i.test(userAgent);

		// Exclude these browsers immediately
		if (isBrave || isAtlas || isEdge || isOtherChromium) {
			setIsChromeDesktop(false);
			return;
		}

		// Additional check: If Client Hints are available, verify it's actually Google Chrome
		// This catches cases where browsers might not be caught by the above checks
		// (e.g., Brave or Atlas that don't expose their identity in user agent)
		if (navigator.userAgentData?.brands) {
			// Check if any brand explicitly identifies as a non-Chrome browser
			const knownNonChromeBrands = [
				"Brave",
				"Microsoft Edge",
				"Opera",
				"Vivaldi",
				"Yandex",
			];
			const hasKnownNonChromeBrand = navigator.userAgentData.brands.some(
				(brand) => knownNonChromeBrands.includes(brand.brand),
			);
			if (hasKnownNonChromeBrand) {
				setIsChromeDesktop(false);
				return;
			}
		}

		// Primary method: User-Agent Client Hints API (most reliable)
		// Only trust this if it explicitly identifies as "Google Chrome"
		let isChrome = false;
		const hasClientHints = navigator.userAgentData?.brands !== undefined;

		if (hasClientHints) {
			// Check for "Google Chrome" brand specifically
			// This is the most reliable way to detect actual Google Chrome
			isChrome = navigator.userAgentData.brands.some(
				(brand) => brand.brand === "Google Chrome",
			);
			// If Client Hints are available but don't identify as Chrome, it's not Chrome
			// Don't fall back to user-agent string in this case
		} else {
			// Fallback: Only use user-agent string if Client Hints aren't available
			// Be very strict - only show if we're reasonably confident it's Chrome
			const hasChrome = userAgent.includes("Chrome");
			const hasKnownChromiumBrowser =
				/Brave|Edg|Opera|OPR|Vivaldi|Yandex|Chromium/i.test(userAgent);

			// Only show if it looks like Chrome and doesn't match other browsers
			isChrome = hasChrome && !hasKnownChromiumBrowser;
		}

		// Both checks must pass: desktop AND Chrome
		setIsChromeDesktop(isDesktop && isChrome);
	}, []);

	return isChromeDesktop;
};

export default useIsChromeDesktop;
