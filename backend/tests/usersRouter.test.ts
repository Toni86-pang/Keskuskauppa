import request  from "supertest"
import server from "../src/server"

describe("testing route api/users/:id", () => {
	it("returns status code 200", async () => {
		const response = await request(server)
			.get("/api/users/1")
		expect(response.statusCode).toBe(200)
	})
	it("returns status code for invalid route", async () => {
		const response = await request(server)
			.get("/api/users/invalid-route")
		expect(response.status).toBe(400)
	})
})
//---------------------------------------------


describe("POST /register", function () {
	it("should register a new user", function (done) {
		const mockUserData = {
			username: "testuser",
			name: "Test User",
			email: "test@example.com",
			phone: "1234567890",
			address: "123 Test",
			city: "Test",
			postal_code: "12345",
			password: "testpassword",
		}

		request(server)
			.post("/register")
			.send(mockUserData)
			.expect(200)
			.end(function (err) {
				if (err) return done(err)
				done()
			})
	})
})
