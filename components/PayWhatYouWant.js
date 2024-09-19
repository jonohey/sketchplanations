import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";

import styles from "./PayWhatYouWant.module.css";
import SubscribeInline from "./SubscribeInline";

const CARD_OPTIONS = {
	iconStyle: "solid",
	style: {
		base: {
			fontWeight: 500,
			fontFamily: "Inter, sans-serif",
			fontSize: "16px",
			"::placeholder": {
				color: "#A3AEBE",
			},
		},
	},
};

const presetAmounts = [2, 5, 10, 20, 50, null];

const PayWhatYouWant = ({ sketchplanationUid, sketchplanationTitle }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [free, setFree] = useState(false);
	const [amount, setAmount] = useState(10);
	const [customAmount, setCustomAmount] = useState(null);
	const [customerEmail, setCustomerEmail] = useState("");
	const [error, setError] = useState(null);
	const [cardComplete, setCardComplete] = useState(false);
	const [processing, setProcessing] = useState(false);
	const [paymentIntent, setPaymentIntent] = useState(null);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const stripeAmount = Number.parseFloat(customAmount || amount);

		if (isNaN(stripeAmount)) return alert("Oops, did you name your own price?");
		if (stripeAmount < 0.3)
			return alert("Sorry, the amount must be at least £0.30");

		if (!stripe || !elements) return;
		if (error) return elements.getElement("card").focus();
		if (cardComplete) setProcessing(true);

		const cardElement = elements.getElement(CardElement);

		try {
			const response = await fetch(`/api/pi`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					amount: stripeAmount,
					sketchplanationTitle,
					customerEmail,
				}),
			});

			const data = await response.json();

			try {
				const payload = await stripe.confirmCardPayment(data.clientSecret, {
					payment_method: {
						card: cardElement,
					},
				});

				setProcessing(false);

				if (payload.error) {
					setError(payload.error);
				} else {
					setPaymentIntent(payload.paymentIntent);
				}
			} catch (e) {
				setProcessing(false);
				console.error(e);
			}
		} catch (e) {
			setError("Sorry, something went wrong");
			setProcessing(false);
			console.error(e);
		}
	};

	const handleCardElementChange = (e) => {
		setError(e.error);
		setCardComplete(e.complete);
	};

	const [subscribeInlineDoc, setSubscribeInlineDoc] = useState(null);
		useEffect(() => {
		fetch("/api/subscribeInlineDoc")
			.then((res) => res.json())
			.then(setSubscribeInlineDoc);
		},
	[]);
	
	return (
		<div>
			<h2 className={styles.header}>
				Download
			</h2>
			<div className={styles.main}>
				{free || paymentIntent ? (
					<div className="space-y-6">
						{paymentIntent && (
							<p className="text-lg font-semibold">
								Thanks for your support!
							</p>
						)}
						<div>
							<p className="mb-4">
								Here&apos;s a high resolution version of the sketch:
							</p>
							<button className="btn-primary inline-block hover:brightness-110 dark:hover:brightness-125 transition-all duration-200 transform hover:scale-105">
								<a
									href={`/api/dl?uid=${sketchplanationUid}`}
									download
									rel="noreferrer"
									target="_blank"
									className="flex items-center"
								>
									<Download size={18} className="mr-2" />
									Download {sketchplanationTitle}
								</a>
							</button>
						</div>
						<div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-700">
							<p>
								Commercial usage? Please see the{" "}
								<a
									href="/licence"
									target="_blank"
									rel="noreferrer"
									className="text-blue-600 hover:underline"
								>
									licence
									<ExternalLink size={14} className="inline-block ml-1 mb-1" />
								</a>
							</p>
							<p>
								Enjoying the sketches?&nbsp;
								<a
									href="https://www.patreon.com/sketchplanations"
									target="_blank"
									rel="noreferrer"
									className="text-blue-600 hover:underline"
								>
									Support me on Patreon
									<ExternalLink size={14} className="inline-block ml-1 mb-1" />
								</a>
								&nbsp;or subscribe by email below
							</p>
						</div>
						<SubscribeInline doc={subscribeInlineDoc} />
					</div>
				) : (
					<>
						<p>
							You’re free to use sketchplanations in your articles or
							presentations as you wish. Please spread the word! (see{" "}
							<Link href="/licence">licence</Link>) If it’s useful to you please
							consider paying a small amount to help keep it going.
						</p>
						<p>Jono</p>
						<form className={styles.form} onSubmit={handleSubmit}>
							<div>
								<div className={styles["amount-options"]}>
									{presetAmounts.map((presetAmount) => (
										<label key={presetAmount}>
											<input
												type="radio"
												name="amount"
												value={amount}
												checked={presetAmount === amount}
												onChange={() => setAmount(presetAmount)}
											/>
											<span>{presetAmount ? `£${presetAmount}` : "Other"}</span>
										</label>
									))}
								</div>
							</div>
							{!amount && (
								<div>
									<div className={styles["amount-input"]}>
										<CurrencyInput
											prefix="£"
											placeholder="Name your own price (min. £0.30)"
											defaultValue={customAmount || ""}
											allowDecimals={true}
											decimalsLimit={2}
											allowNegativeValue={false}
											turnOffAbbreviations={true}
											onValueChange={setCustomAmount}
										/>
									</div>
								</div>
							)}
							<div>
								<div className={styles.cardInput}>
									<CardElement
										options={CARD_OPTIONS}
										onChange={handleCardElementChange}
									/>
								</div>
								{error && <div className={styles.error}>{error.message}</div>}
							</div>
							<div>
								<input
									className={styles["email-input"]}
									type="text"
									placeholder="Your email address - for receipt"
									value={customerEmail}
									onChange={(e) => setCustomerEmail(e.target.value)}
								/>
							</div>
							<div>
								<button
									className={styles["pay-button"]}
									type="submit"
									disabled={processing || !stripe}
								>
									{processing ? "Processing…" : "Pay and download"}
								</button>
								<button
									className={styles["free-button"]}
									type="button"
									onClick={() => setFree(true)}
								>
									Download for free
								</button>
							</div>
						</form>
						<div className={styles.footer}>
							<div className={styles["stripe-climate"]}>
								{/*eslint-disable-next-line @next/next/no-img-element */}
								<img src="/stripe-climate-badge.svg" />
								<span>
									Sketchplanations will contribute <b>2% of your purchase</b> to
									remove CO₂ from the atmosphere
								</span>
							</div>
							<a href="https://stripe.com/" rel="noreferrer" target="_blank">
								<svg
									className={styles["powered-by-stripe"]}
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 150 34"
								>
									<path d="M17.07 11.24h-4.3V22h1.92v-4.16h2.38c2.4 0 3.9-1.16 3.9-3.3s-1.5-3.3-3.9-3.3zm-.1 5h-2.28v-3.3H17c1.38 0 2.11.59 2.11 1.65s-.76 1.6-2.11 1.6zM25.1 14a3.77 3.77 0 00-3.8 4.09 3.81 3.81 0 107.59 0A3.76 3.76 0 0025.1 14zm0 6.67c-1.22 0-2-1-2-2.58s.76-2.58 2-2.58 2 1 2 2.58-.79 2.57-2 2.57zM36.78 19.35l-1.41-5.22h-1.48l-1.4 5.22-1.42-5.22h-1.85l2.37 7.88h1.56l1.44-5.16 1.44 5.16h1.56l2.37-7.88h-1.78l-1.4 5.22zM44 14a3.83 3.83 0 00-3.75 4.09 3.79 3.79 0 003.83 4.09A3.47 3.47 0 0047.49 20L46 19.38a1.78 1.78 0 01-1.83 1.26A2.12 2.12 0 0142 18.47h5.52v-.6C47.54 15.71 46.32 14 44 14zm-1.93 3.13A1.92 1.92 0 0144 15.5a1.56 1.56 0 011.69 1.62zM50.69 15.3v-1.17h-1.8V22h1.8v-4.13a1.89 1.89 0 012-2 4.68 4.68 0 01.66 0v-1.8h-.51a2.29 2.29 0 00-2.15 1.23zM57.48 14a3.83 3.83 0 00-3.75 4.09 3.79 3.79 0 003.83 4.09A3.47 3.47 0 0060.93 20l-1.54-.59a1.78 1.78 0 01-1.83 1.26 2.12 2.12 0 01-2.1-2.17H61v-.6c0-2.19-1.24-3.9-3.52-3.9zm-1.93 3.13a1.92 1.92 0 011.92-1.62 1.56 1.56 0 011.69 1.62zM67.56 15a2.85 2.85 0 00-2.26-1c-2.21 0-3.47 1.85-3.47 4.09s1.26 4.09 3.47 4.09a2.82 2.82 0 002.26-1V22h1.8V11.24h-1.8zm0 3.35a2 2 0 01-2 2.28c-1.31 0-2-1-2-2.52s.7-2.52 2-2.52c1.11 0 2 .81 2 2.29zM79.31 14A2.88 2.88 0 0077 15v-3.76h-1.8V22H77v-.83a2.86 2.86 0 002.27 1c2.2 0 3.46-1.86 3.46-4.09S81.51 14 79.31 14zM79 20.6a2 2 0 01-2-2.28v-.47c0-1.48.84-2.29 2-2.29 1.3 0 2 1 2 2.52s-.75 2.52-2 2.52zM86.93 19.66L85 14.13h-1.9l2.9 7.59-.3.74a1 1 0 01-1.14.79 4.12 4.12 0 01-.6 0v1.51a4.62 4.62 0 00.73.05 2.67 2.67 0 002.78-2l3.24-8.62h-1.89zM125 12.43a3 3 0 00-2.13.87l-.14-.69h-2.39v12.92l2.72-.59v-3.13a3 3 0 001.93.7c1.94 0 3.72-1.59 3.72-5.11 0-3.22-1.8-4.97-3.71-4.97zm-.65 7.63a1.61 1.61 0 01-1.28-.52v-4.11a1.64 1.64 0 011.3-.55c1 0 1.68 1.13 1.68 2.58s-.69 2.6-1.7 2.6zM133.73 12.43c-2.62 0-4.21 2.26-4.21 5.11 0 3.37 1.88 5.08 4.56 5.08a6.12 6.12 0 003-.73v-2.25a5.79 5.79 0 01-2.7.62c-1.08 0-2-.39-2.14-1.7h5.38v-1c.09-2.87-1.27-5.13-3.89-5.13zm-1.47 4.07c0-1.26.77-1.79 1.45-1.79s1.4.53 1.4 1.79zM113 13.36l-.17-.82h-2.32v9.71h2.68v-6.58a1.87 1.87 0 012.05-.58v-2.55a1.8 1.8 0 00-2.24.82zM99.46 15.46c0-.44.36-.61.93-.61a5.9 5.9 0 012.7.72v-2.63a7 7 0 00-2.7-.51c-2.21 0-3.68 1.18-3.68 3.16 0 3.1 4.14 2.6 4.14 3.93 0 .52-.44.69-1 .69a6.78 6.78 0 01-3-.9V22a7.38 7.38 0 003 .64c2.26 0 3.82-1.15 3.82-3.16-.05-3.36-4.21-2.76-4.21-4.02zM107.28 10.24l-2.65.58v8.93a2.77 2.77 0 002.82 2.87 4.16 4.16 0 001.91-.37V20c-.35.15-2.06.66-2.06-1v-4h2.06v-2.34h-2.06zM116.25 11.7l2.73-.57V8.97l-2.73.57v2.16zM116.25 12.61h2.73v9.64h-2.73z" />
								</svg>
							</a>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default PayWhatYouWant;
