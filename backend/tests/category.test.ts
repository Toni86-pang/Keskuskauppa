import request from "supertest"
import server from "../src/server"


//category tests
describe("testing api/category", () => {
	it("returns status code 200", async () => {
		const response = await request(server)
			.get("/api/category")
		expect(response.statusCode).toBe(200)
	})

	it("returns status code 404 for invalid route", async () => {
		const response = await request(server)
			.get("/api/invalid-route")
		expect(response.statusCode).toBe(404)
	})
})

//subcategory tests
describe("testing api/category/subcategory", () => {
	it("returns status code 200", async () => {
		const response = await request(server)
			.get("/api/category/subcategory")
		expect(response.statusCode).toBe(200)
	})

	it("returns status code 404 for invalid route", async () => {
		const response = await request(server)
			.get("/api/category/invalid-route")
		expect(response.statusCode).toBe(404)
	})

})
