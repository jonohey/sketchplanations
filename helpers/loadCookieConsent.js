import cookieConstentConfig from "cookieConstentConfig.mjs";

let loadPromise;

export function loadCookieConsent() {
	if (!loadPromise) {
		loadPromise = (async () => {
			const CookieConsent = await import("vanilla-cookieconsent");
			CookieConsent.run(cookieConstentConfig);
		})();
	}

	return loadPromise;
}
