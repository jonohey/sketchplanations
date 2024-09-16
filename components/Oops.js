import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import styles from "./Oops.module.css";

import { pageTitle } from "helpers";

import oopsImage from "../public/oops.png";

const loader = ({ src }) => src;

const Oops = ({ children }) => {
	return (
		<>
			<Head>
				<title>{pageTitle("Oops")}</title>
			</Head>
			<div className={styles.main}>
				<div className={styles.image}>
					<Image
						src={oopsImage}
						alt="Error"
						width={640}
						height={542.5}
						loader={loader}
					/>
				</div>
				{children}
				<p>
					Maybe <Link href="/explore">search Sketchplanations</Link> or try
					looking in <Link href="/categories">categories</Link>?
				</p>
				<p>
					Please let me know if a link is broken so I can fix it for others. I’m
					at{" "}
					<a href="mailto:jono.hey@gmail.com?subject=Broken link to fix!">
						jono.hey@gmail.com
					</a>
				</p>
			</div>
		</>
	);
};

export default Oops;
