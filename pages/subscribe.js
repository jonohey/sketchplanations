import { track } from "@vercel/analytics";
import Page from "components/Page";
import { pageTitle } from "helpers";
import Head from "next/head";
import { useState } from "react";
import { client } from "services/prismic";

import styles from "./subscribe.module.css";

const Subscribe = ({ subscribeDocument, subscribedDocument }) => {
	const [email, setEmail] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [processing, setProcessing] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setProcessing(true);

		await fetch("/api/subscribe", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
			}),
		});

		try {
			track('Subscribe', { source: 'subscribe-page', pageUrl: window.location.pathname });
		} catch (error) {
			console.error('Failed to send Vercel analytics event:', error);
		}

		setSubmitted(true);
		setProcessing(false);
	};

	if (submitted) return <Page document={subscribedDocument} />;

	return (
		<>
			<Head>
				<title>{pageTitle("Subscribe")}</title>
				<meta
					name="description"
					content="Get a new Sketchplanation in your inbox every week"
				/>
			</Head>
			<Page document={subscribeDocument}>
				<form onSubmit={handleSubmit}>
					<input
						className={styles.input}
						type="email"
						required
						placeholder="Email address"
						autoComplete="email"
						pattern=".+@.+"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						disabled={processing}
					/>
					<button type="submit" className={styles.button}>
						{processing ? "Subscribing…" : "Subscribe"}
					</button>
				</form>
			</Page>
		</>
	);
};

export async function getStaticProps() {
	const subscribeDocument = await client.getSingle("subscribe");
	const subscribedDocument = await client.getSingle("subscribed");
	return { props: { subscribeDocument, subscribedDocument } };
}

export default Subscribe;
