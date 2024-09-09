import * as Sentry from "@sentry/react";

import Oops from "components/Oops";

const ErrorPage = () => {
	return <Oops />;
};

export async function getServerSideProps({ res, err }) {
	const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
	Sentry.captureException(err);
	return { props: { statusCode } };
}

export default ErrorPage;
