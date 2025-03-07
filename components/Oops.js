import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { pageTitle } from "helpers";
import styles from "./Oops.module.css";

import oopsImage from "../public/oops.png";

const loader = ({ src }) => src;

const Oops = ({ children }) => {
	return (
		<>
			<Head>
				<title>{pageTitle("Oops")}</title>
			</Head>
			<main className={`${styles.main} max-w-3xl mx-auto px-4 py-8 text-center prose prose-blue`}>
				<h1 className="sr-only">Page Not Found</h1>
				<div className="mb-8 not-prose flex justify-center">
					<Image
						src={oopsImage}
						alt="Error"
						width={640}
						height={542.5}
						loader={loader}
						aria-label="404 error illustration"
						className={styles.image}
					/>
				</div>
				{children}
				<div className="space-y-6">
					<p className="mb-4">
						Maybe try <Link href="/search">search</Link> or <Link href="/categories">categories</Link>?
					</p>
					<p>
						Please <Link href="https://forms.gle/aVeicJAyn38FDR4F8" target="_blank" rel="noopener noreferrer">report the broken link</Link> to me so I can fix it for others. Or email me
						at{" "}
						<a href="mailto:jono.hey@gmail.com?subject=404%20Error%20-%20Broken%20Link%20Report">
							jono.hey@gmail.com
						</a>
					</p>
					<p>
						<Link href="/">Return to Home</Link>
					</p>
				</div>
			</main>
		</>
	);
};

export default Oops;
