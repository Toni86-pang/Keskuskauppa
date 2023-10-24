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

	it("test post review without token and without content", async () => {
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

describe("testing GET reviews by seller_id", () => {

	const mockResponse = {
		rows: [
			{
				"review_id": 1,
				"sales_id": 66,
				"seller_id": 1,
				"buyer_id": 94,
				"description": "nopea lähetys",
				"review_date": "2023-10-22T14:34:16.511Z",
				"seen": false,
				"stars": 4
			},
			{
				"review_id": 2,
				"sales_id": 66,
				"seller_id": 1,
				"buyer_id": 94,
				"description": "nopea lähetys",
				"review_date": "2023-10-22T15:10:51.757Z",
				"seen": false,
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

	it("test get reviews by seller_id", async () => {
		const response = await request(server).get("/api/review/user/1")
			.send({})
		expect(response.status).toBe(200)
	})

})

describe("testing GET by review_id", () => {

	const mockResponse = {
		rows: [{
			"review_id": 1,
			"sales_id": 66,
			"seller_id": 1,
			"buyer_id": 94,
			"description": "nopea lähetys",
			"review_date": "2023-10-22T14:34:16.511Z",
			"seen": false,
			"stars": 4
		}]
	}

	beforeAll(() => {
		initializeMockPool(mockResponse)
	})

	afterAll(() => {
		jest.clearAllMocks()
	})

	it("test get existing review", async () => {
		const response = await request(server).get("/api/review/1")
			.send({})
		expect(response.status).toBe(200)
	})
})
