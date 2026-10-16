import Head from "next/head";

import LicenceContent from "components/LicenceContent";
import { pageTitle } from "helpers";

const Licence = () => (
	<>
		<Head>
			<title>{pageTitle("Licence")}</title>
			<meta
				name="description"
				content="How to share and use Sketchplanations considerately — including in books, articles, and presentations. Follow the licence terms to help more people find the sketches they love."
			/>
			<link rel="canonical" href="https://sketchplanations.com/licence" />
		</Head>
		<LicenceContent />
	</>
);

export default Licence;
