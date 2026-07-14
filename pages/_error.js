import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";

import Oops from "components/Oops";

const ErrorPage = () => {
	return <Oops />;
};

ErrorPage.getInitialProps = async (contextData) => {
	// Give Sentry time to flush before a serverless function exits
	await Sentry.captureUnderscoreErrorException(contextData);

	return NextError.getInitialProps(contextData);
};

export default ErrorPage;
