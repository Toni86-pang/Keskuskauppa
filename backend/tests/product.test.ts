import request from "supertest"
import server from "../src/server"


//GET all products by one category tests
describe("testing that route is ok", () => {
	it("returns status code 200", async () => {
		const categoryId = 1
		const response = await request(server)
			.get(`/api/product/category/${categoryId}`)
		expect(response.status).toBe(200)
	})

	it("returns status code 400 if categoryId is a string", async () => {
		const invalidCategoryId = "abcdefg"
		const response = await request(server)
			.get(`/api/product/category/${invalidCategoryId}`)
		expect(response.status).toBe(400)
	})
	
	it("returns status code 400, if number isn't integer", async () => {
		const invalidCategoryId = "2,123"
		const response = await request(server)
			.get(`/api/product/category/${invalidCategoryId}`)
		expect(response.status).toBe(400)
	})
})