import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Analytics } from "@vercel/analytics/react";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useEffect, useState } from "react";
import * as CookieConsent from "vanilla-cookieconsent";

import Header from "components/Header";
import { pageTitle } from "helpers";

import { GoogleTagManager } from "../gtm";

import BuyMeACoffee from "components/BuyMeACoffee";
import Context from "context";
import cookieConstentConfig from "cookieConstentConfig.mjs";

import "vanilla-cookieconsent/dist/cookieconsent.css";
import "global.css";
import Footer from "components/Footer";
import { PrismicPreview } from "@prismicio/next";

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

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
	Sentry.init({
		enabled: process.env.NODE_ENV === "production",
		dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
		integrations: [new Integrations.BrowserTracing()],
		tracesSampleRate: 1.0,
	});
}

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

const ELEMENTS_OPTIONS = {
	fonts: [
		{
			cssSrc:
				"https://fonts.googleapis.com/css2?family=Inter:wght@300;600&display=swap",
		},
	],
};

const Sketchplanations = ({ Component, pageProps }) => {
	const [decorationHidden, setDecorationHidden] = useState(false);

	useEffect(() => {
		polyfillDownloadAttr();
	}, []);

	useEffect(() => {
		CookieConsent.run(cookieConstentConfig);
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
				<Elements stripe={stripePromise} options={ELEMENTS_OPTIONS}>
					<Head>
						<title>{pageTitle()}</title>
					</Head>
					<div className={inter.className}>
						<Header />
						<Component {...pageProps} />
						<BuyMeACoffee />
						<Footer />
					</div>
				</Elements>
				<Analytics />
			</Context.Provider>
		</PrismicPreview>
	);
};

// TODO: Do this in setup.js
// Sketchplanations.getInitialProps = async () => {
// 	const subscribeInlineDoc = await client.getSingle("subscribe_inline");

// 	return { subscribeInlineDoc };
// };

export default Sketchplanations;
