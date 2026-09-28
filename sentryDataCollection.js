/** v11 defaults collect more data; match prior v10 behaviour (sendDefaultPii unset). */
export const sentryDataCollection = {
	userInfo: false,
	cookies: false,
	httpHeaders: {
		request: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
		response: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
	},
	httpBodies: [],
	urlQueryParams: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
	genAI: { inputs: false, outputs: false },
	databaseQueryData: false,
	graphQL: { document: false, variables: false },
};
