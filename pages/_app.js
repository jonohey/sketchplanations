import { PrismicPreview } from "@prismicio/next/pages";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "components/Footer";
import Header from "components/Header";
import JsonLd from "components/JsonLd";
import Context from "context";
import cookieConstentConfig from "cookieConstentConfig.mjs";
import { pageTitle } from "helpers";
import runWhenIdle from "helpers/runWhenIdle";
import { buildSiteGraph } from "helpers/structuredData";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import { GoogleTagManager } from "../gtm";

import "global.css";

const BuyMeACoffee = dynamic(() => import("components/BuyMeACoffee"), {
	ssr: false,
});

const inter = Inter({ subsets: ["latin"], weights: [300, 600] });

const polyfillDownloadAttr = () => {
	const downloadAttributeSupport = "download" in document.createElement("a");
	const msSaveBlob = typeof window.navigator.msSaveBlob !== "undefined";

	if (!downloadAttributeSupport && msSaveBlob) {
		document.addEventListener("click", (evt) => {
			const { target } = evt;
			const { tagName } = target;

			if (tagName === "A" && target.hasAttribute("download")) {
				evt.preventDefault();

				const { href } = target;
				const fileName = new URL(href).pathname.split("/").pop();

				const xhr = new XMLHttpRequest();

				xhr.open("GET", href);

				xhr.responseType = "blob";

				xhr.onreadystatechange = () => {
					if (xhr.readyState !== 4) {
						return;
					}

					if (xhr.status === 200) {
						window.navigator.msSaveBlob(xhr.response, fileName);
					} else {
						console.error(
							"download-attribute-polyfill:",
							xhr.status,
							xhr.statusText,
						);
					}
				};

				xhr.send();
			}
		});
	}
};

const Sketchplanations = ({ Component, pageProps }) => {
	const [decorationHidden, setDecorationHidden] = useState(false);

	// Pages can define their own layout via Component.getLayout
	// Default layout includes Header, BuyMeACoffee, and Footer
	const getLayout = Component.getLayout ?? ((page) => (
		<>
			<Header />
			{page}
			<BuyMeACoffee />
			<Footer />
		</>
	));

	useEffect(() => {
		polyfillDownloadAttr();
	}, []);

	useEffect(() => {
		return runWhenIdle(async () => {
			await import("vanilla-cookieconsent/dist/cookieconsent.css");
			await import("../vanilla-cookieconsent.css");
			const CookieConsent = await import("vanilla-cookieconsent");
			CookieConsent.run(cookieConstentConfig);
		});
	}, []);

	return (
		<PrismicPreview repositoryName="sketchplanations">
			<Context.Provider
				value={{
					decorationHidden,
					setDecorationHidden,
				}}
			>
				<GoogleTagManager gtmId="GTM-WNS3LG4" />
				<Head>
					<title>{pageTitle()}</title>
					<meta
						name="viewport"
						content="width=device-width, initial-scale=1, minimum-scale=1"
					/>
				</Head>
				<JsonLd data={buildSiteGraph()} />
				<div className={inter.className}>
					{getLayout(<Component {...pageProps} />)}
				</div>
				<Analytics />
				<SpeedInsights sampleRate={0.5} />
			</Context.Provider>
		</PrismicPreview>
	);
};

export default Sketchplanations;
