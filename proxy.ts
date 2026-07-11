import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
	const isLocalhost = request.headers.get("host")?.includes("localhost");

	const cfCountry = request.headers.get("cf-ipcountry");
	const vercelCountry = request.headers.get("x-vercel-ip-country");
	const detectedCountry = cfCountry || vercelCountry;

	const testCountry = request.nextUrl.searchParams.get("country");
	const country = isLocalhost
		? testCountry || "BOTH"
		: detectedCountry || "BOTH";

	if (process.env.NODE_ENV === "development") {
		console.log("Proxy debug:", {
			isLocalhost,
			cfCountry,
			vercelCountry,
			detectedCountry,
			testCountry,
			country,
		});
	}

	const requestHeaders = new Headers(request.headers);
	requestHeaders.set("x-country", country);

	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	});
}

export const config = {
	matcher: "/big-ideas-little-pictures",
};
