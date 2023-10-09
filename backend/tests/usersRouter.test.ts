import request  from "supertest"
import server from "../src/server"

describe("testing route api/users/product/:productId", () => {
	it("returns status code 200", async () => {
		const response = await request(server)
			.get("/api/users/product/1")
		expect(response.statusCode).toBe(200)
	})
	it("returns status code for invalid route", async () => {
		const response = await request(server)
			.get("/api/users/invalid-route")
		expect(response.status).toBe(404)
	})
})
