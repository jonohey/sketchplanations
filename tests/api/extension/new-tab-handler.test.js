import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import createNewTabHandler from "../../../pages/api/extension/_shared/new-tab-handler";

const { trackMock, kvMock, prismicClientMock } = vi.hoisted(() => ({
	trackMock: vi.fn(() => Promise.resolve()),
	kvMock: { srandmember: vi.fn() },
	prismicClientMock: { getByUID: vi.fn() },
}));

vi.mock("@vercel/analytics/server", () => ({ track: trackMock }));
vi.mock("@vercel/kv", () => ({ kv: kvMock }));
vi.mock("services/prismic", () => ({ client: prismicClientMock }));
vi.mock("@prismicio/helpers", () => ({
	asText: (body) => body?.map?.((part) => part.text).join(" ") ?? "",
}));

const createResponse = () => {
	const headers = {};
	return {
		headers,
		statusCode: undefined,
		body: undefined,
		setHeader: (key, value) => {
			headers[key] = value;
		},
		status(code) {
			this.statusCode = code;
			return this;
		},
		end() {
			this.ended = true;
			return this;
		},
		json(payload) {
			this.body = payload;
			return this;
		},
	};
};

const createRequest = (method, overrides = {}) => {
	const url = overrides.url ?? "/api/extension/new-tab";
	return {
		method,
		url,
		socket: { remoteAddress: "203.0.113.99" },
		headers: {
			host: "test.local",
			cookie: "",
			"user-agent": "vitest",
			"x-forwarded-for": "127.0.0.1",
			...overrides.headers,
		},
		...overrides,
	};
};

describe("createNewTabHandler", () => {
	let originalMathRandom;
	let consoleErrorSpy;

	beforeEach(() => {
		trackMock.mockClear();
		kvMock.srandmember.mockReset();
		prismicClientMock.getByUID.mockReset();
		originalMathRandom = Math.random;
		consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		consoleErrorSpy?.mockRestore();
		Math.random = originalMathRandom;
	});

	it("returns a sketch and tracks success with the api version", async () => {
		const handler = createNewTabHandler({ apiVersion: "v1" });
		const req = createRequest("GET");
		const res = createResponse();

		Math.random = vi.fn(() => 0.1);
		kvMock.srandmember.mockImplementation(async (key) =>
			key === "sketchplanations_newer" ? "daily-habits" : "daily-habits",
		);
		prismicClientMock.getByUID.mockResolvedValue({
			uid: "daily-habits",
			data: {
				title: "Daily habits",
				body: [{ type: "paragraph", text: "Sketch body" }],
				image: {
					url: "https://imgix.net/sketch.png?foo=bar",
					alt: "Sketch alt",
					dimensions: { width: 600, height: 400 },
				},
				redbubble_link_url: "https://prints.test",
				podcast_link_url: "https://podcast.test",
				published_at: "2024-01-01",
			},
		});

		await handler(req, res);

		expect(res.statusCode).toBe(200);
		expect(res.body).toMatchObject({
			uid: "daily-habits",
			title: "Daily habits",
			description: "Sketch body",
			imageUrl: "https://imgix.net/sketch.png?auto=format,compress",
			imageUrlOptimised:
				"https://imgix.net/sketch.png?auto=format,compress&w=800&q=85",
			imageAlt: "Sketch alt",
			pageUrl: "https://sketchplanations.com/daily-habits",
			podcastUrl: "https://podcast.test",
			redbubbleUrl: "https://prints.test",
		});

		expect(trackMock).toHaveBeenCalledWith(
			"extension_new_tab_request",
			{
				apiVersion: "v1",
				status: "success",
				sketchTitle: "Daily habits",
			},
			{
				headers: expect.objectContaining({
					...req.headers,
					referer: "https://test.local/api/extension/new-tab",
					"user-agent": "vitest",
					"x-forwarded-for": "127.0.0.1",
				}),
			},
		);
	});

	it("handles OPTIONS requests without tracking events", async () => {
		const handler = createNewTabHandler({ apiVersion: "v1" });
		const req = createRequest("OPTIONS");
		const res = createResponse();

		await handler(req, res);

		expect(res.statusCode).toBe(200);
		expect(res.ended).toBe(true);
		expect(trackMock).not.toHaveBeenCalled();
	});

	it("returns 405 for non-GET methods and tracks invalid_method", async () => {
		const handler = createNewTabHandler({ apiVersion: "legacy" });
		const req = createRequest("POST");
		const res = createResponse();

		await handler(req, res);

		expect(res.statusCode).toBe(405);
		expect(res.body).toEqual({ error: "Method not allowed" });
		expect(trackMock).toHaveBeenCalledWith(
			"extension_new_tab_request",
			{
				apiVersion: "legacy",
				status: "invalid_method",
				method: "POST",
			},
			{
				headers: expect.objectContaining({
					...req.headers,
					referer: "https://test.local/api/extension/new-tab",
				}),
			},
		);
	});

	it("returns 404 when no sketch handles are available", async () => {
		const handler = createNewTabHandler({ apiVersion: "v1" });
		const req = createRequest("GET");
		const res = createResponse();

		Math.random = vi.fn(() => 0.8);
		kvMock.srandmember.mockResolvedValue(null);

		await handler(req, res);

		expect(res.statusCode).toBe(404);
		expect(res.body).toEqual({ error: "No sketchplanations found" });
		expect(trackMock).toHaveBeenCalledWith(
			"extension_new_tab_request",
			{
				apiVersion: "v1",
				status: "not_found",
			},
			{
				headers: expect.objectContaining({
					...req.headers,
					referer: "https://test.local/api/extension/new-tab",
				}),
			},
		);
	});

	it("returns 500 on unexpected errors and tracks error result", async () => {
		const handler = createNewTabHandler({ apiVersion: "v1" });
		const req = createRequest("GET");
		const res = createResponse();

		Math.random = vi.fn(() => 0.1);
		kvMock.srandmember.mockResolvedValue("broken-handle");
		prismicClientMock.getByUID.mockRejectedValue(new Error("Boom"));

		await handler(req, res);

		expect(res.statusCode).toBe(500);
		expect(res.body?.error).toBeDefined();
		expect(trackMock).toHaveBeenCalledWith(
			"extension_new_tab_request",
			{
				apiVersion: "v1",
				status: "error",
				errorType: "Error",
			},
			{
				headers: expect.objectContaining({
					...req.headers,
					referer: "https://test.local/api/extension/new-tab",
				}),
			},
		);
	});

	it("returns null for optional URLs when missing", async () => {
		const handler = createNewTabHandler({ apiVersion: "v1" });
		const req = createRequest("GET");
		const res = createResponse();

		Math.random = vi.fn(() => 0.1);
		kvMock.srandmember.mockResolvedValue("missing-links");
		prismicClientMock.getByUID.mockResolvedValue({
			uid: "missing-links",
			data: {
				title: "Missing links",
				body: [{ type: "paragraph", text: "No links here" }],
				image: {
					url: "https://imgix.net/missing.png",
					alt: "No links",
					dimensions: { width: 400, height: 300 },
				},
				published_at: "2024-02-02",
			},
		});

		await handler(req, res);

		expect(res.statusCode).toBe(200);
		expect(res.body.redbubbleUrl).toBeNull();
		expect(res.body.podcastUrl).toBeNull();
	});
});

