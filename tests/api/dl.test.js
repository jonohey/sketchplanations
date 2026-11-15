import * as prismic from "@prismicio/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

import handler from "../../pages/api/dl";

const { prismicClientMock } = vi.hoisted(() => ({
	prismicClientMock: { getByUID: vi.fn() },
}));

vi.mock("services/prismic", () => ({ client: prismicClientMock }));
vi.mock("node-fetch", () => ({ default: vi.fn() }));

const createResponse = () => ({
	statusCode: undefined,
	body: undefined,
	setHeader: vi.fn(),
	status(code) {
		this.statusCode = code;
		return this;
	},
	send(body) {
		this.body = body;
		return this;
	},
});

describe("/api/dl", () => {
	beforeEach(() => {
		prismicClientMock.getByUID.mockReset();
	});

	it("returns 400 without querying Prismic when uid is missing", async () => {
		const res = createResponse();
		await handler({ query: {} }, res);
		expect(res.statusCode).toBe(400);
		expect(prismicClientMock.getByUID).not.toHaveBeenCalled();
	});

	it("returns 404 when the sketchplanation does not exist", async () => {
		prismicClientMock.getByUID.mockRejectedValue(
			new prismic.NotFoundError("No documents were returned", "url", undefined),
		);
		const res = createResponse();
		await handler({ query: { uid: "nope" } }, res);
		expect(res.statusCode).toBe(404);
	});
});
