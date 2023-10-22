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

describe("testing POST review", () => {

	const mockResponse = {
		rows: [
			{
				"review_id": 1,
				"sales_id": 66,
				"seller_id": 1,
				"buyer_id": 94,
				"description": "nopea lähetys",
				"review_date": "2023-10-22 17:34:16.511328",
				"seen": "false",
				"stars": 4
			}
		]
	}

	beforeAll(() => {
		initializeMockPool(mockResponse)
	})

	afterAll(() => {
		jest.clearAllMocks()
	})

	it("test post review without token", async () => {
		const response = await request(server).post("/api/review/")
			.send({})
		expect(response.status).toBe(401)
	})

	it("test post review with incomplete information", async () => {
		const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hdW1hIiwiaWQiOjk0LCJpYXQiOjE2OTc3MDcxMzN9.oLNkVTzLKJmoZvL8DddoktO-wPLYMqdOkQqhM48yKks"
		const response = await request(server).post("/api/review/")
			.set("Authorization", `Bearer ${token}`)
			.send({
				"sales_id": 66,
				"buyer_id": 94,
				"description": "nopea lähetys",
				"seen": "false",
				"stars": 4
			})
		expect(response.status).toBe(400)
	})

	it("test post review with all information", async () => {
		const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hdW1hIiwiaWQiOjk0LCJpYXQiOjE2OTc3MDcxMzN9.oLNkVTzLKJmoZvL8DddoktO-wPLYMqdOkQqhM48yKks"
		const response = await request(server).post("/api/review/")
			.set("Authorization", `Bearer ${token}`)
			.send({
				"sales_id": 66,
				"seller_id": 1,
				"buyer_id": 94,
				"description": "nopea lähetys",
				"seen": "false",
				"stars": 4
			})
		expect(response.status).toBe(201)
	})

})
