import request from "supertest"
import { pool } from "../src/database"
import { jest } from "@jest/globals"
import { server } from "../src/server"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initializeMockPool = (mockResponse: any) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(pool as any).connect = jest.fn(() => {
		return {
			query: () => mockResponse,
			release: () => null
		}
	})
}

describe("testing GET sale", () => {

	const mockResponse = {
		rows: [
			{
				"sales_id": 10,
				"product_id": 85,
				"buyer_id": 127,
				"buyer_name": "Ossi",
				"buyer_address": "Jokukuja 1",
				"buyer_city": "JOulumaa",
				"buyer_postcode": "3202332",
				"buyer_phone": "sesagesää",
				"buyer_email": "moi@jou",
				"seller_id": 93,
				"sales_status": 5
			}
		]
	}

	beforeAll(() => {
		initializeMockPool(mockResponse)
	})

	afterAll(() => {
		jest.clearAllMocks()
	})

	it("test get sale without token", async () => {
		const salesId = 10
		const response = await request(server).get("/api/sales/" + salesId)
			.send({})
		expect(response.status).toBe(401)
	})

	it("test get sale with wrong token", async () => {
		const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pc3VsaSIsImlkIjo1NCwiaWF0IjoxNjkzOTk4NjkzfQ.dXwnNmaSGRVh6F5PxUHGLkdJ-YLMJgA6Al85PjsGWTI"
		const salesId = 10
		const response = await request(server).get("/api/sales/" + salesId)
			.set("Authorization", `Bearer ${token}`)
			.send({})
		expect(response.status).toBe(403)
	})

	it("test get sale with right token", async () => {
		const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pc3VuaSIsImlkIjo5MywiaWF0IjoxNjk3MDE5NjE5fQ.LNxDWwc-N5fUnaa8CF3VnTTP7tidPWELmWlQoNG1oD4"
		const salesId = 10
		const response = await request(server).get("/api/sales/" + salesId)
			.set("Authorization", `Bearer ${token}`)
			.send({})
		expect(response.status).toBe(200)
	})

})
