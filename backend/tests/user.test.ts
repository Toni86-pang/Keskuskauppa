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

describe("testing POST /users/login", () => {
	const mockResponse = {
		rows: [
			{ username: "User1", password: "$argon2id$v=19$m=65536,t=3,p=4$NNpUo54Qx2g35Jfmhf+WwQ$KhoL4CvJDp9GVRoGFESWKldrwZ+k4oCgjfgGVkGQ3Xk" }
		]
	}

	beforeAll(() => {
		initializeMockPool(mockResponse)
	})

	afterAll(() => {
		jest.clearAllMocks()
	})

	it("test login without sen req.body", async () => {
		const response = await request(server).post("/api/users/login")
			.send({})
		expect(response.status).toBe(400)
		expect(response.body).toStrictEqual({ error: "Missing request body." })
	})

	it("test login with wrong variables", async () => {
		const response = await request(server).post("/api/users/login")
			.send({ user_username: "TestUser", noPassword: "password" })
		expect(response.status).toBe(400)
		expect(response.body).toStrictEqual({ error: "Missing username or password." })
	})

	it("test login with one wrong variable", async () => {
		const response = await request(server).post("/api/users/login")
			.send({ username: "TestUser", noPassword: "password" })
		expect(response.status).toBe(400)
		expect(response.body).toStrictEqual({ error: "Missing username or password." })
	})

	it("test login with username that does not exist", async () => {
		const response = await request(server).post("/api/users/login")
			.send({ username: "TestUser", password: "password" })
		expect(response.status).toBe(401)
		expect(response.body).toStrictEqual({ error: "Username not found." })
	})

	it("test login with wrong password", async () => {
		const response = await request(server).post("/api/users/login")
			.send({ username: "User1", password: "password" })
		expect(response.status).toBe(401)
		expect(response.body).toStrictEqual({ error: "Incorrect password." })
	})

	it("test login with right username and password", async () => {
		const response = await request(server).post("/api/users/login")
			.send({ username: "User1", password: "qwerty" })
		expect(response.status).toBe(200)
	})

})

describe("testing PUT /users/update", () => {
	const smallImageData = "image-binary-variable"
	const mockResponse = {
		rows: [
			{
				user_id: 54,
				username: "nisuli",
				name: "Sami Nissinen",
				email: "snisu@snasu.com",
				phone: "+3939393",
				address: "tietöntie 1",
				city: "Joulu",
				postal_code: "90520"
			}
		]
	}

	beforeAll(() => {
		initializeMockPool(mockResponse)
	})

	afterAll(() => {
		jest.clearAllMocks()
	})

	it("test update without token", async () => {
		const response = await request(server).put("/api/users/update")
			.send({})
		expect(response.status).toBe(401)
	})

	it("test update with correct token", async () => {
		const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pc3VsaSIsImlkIjo1NCwiaWF0IjoxNjkzOTk4NjkzfQ.dXwnNmaSGRVh6F5PxUHGLkdJ-YLMJgA6Al85PjsGWTI"
		const response = await request(server).put("/api/users/update")
			.set("Authorization", `Bearer ${token}`)
			.send({
				"email": "snisu@snasu.com",
				"phone": "+3939393",
				"address": "tietöntie 1",
				"city": "Joulu",
				"postal_code": "90520"
			})
		expect(response.status).toBe(200)
	})

	it("test update image", async () => {
		const token =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pc3VsaSIsImlkIjo1NCwiaWF0IjoxNjkzOTk4NjkzfQ.dXwnNmaSGRVh6F5PxUHGLkdJ-YLMJgA6Al85PjsGWTI"
		const response = await request(server).put("/api/users/update")
			.set("Authorization", `Bearer ${token}`)
			.send({ image: smallImageData })

		expect(response.status).toBe(200)

	})
	it("test update image without token", async () => {
		const token = ""
		const response = await request(server).put("/api/users/update")
			.set("Authorization", `Bearer ${token}`)
			.send({ image: smallImageData })

		expect(response.status).toBe(401)
	})

})