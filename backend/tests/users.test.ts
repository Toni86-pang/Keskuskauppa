import request from "supertest"
import server from "../src/server"
import { executeQuery } from "../src/database"

const smallImageData = "image-binary-variable"

describe("api/users/register", () => {

	it("returns status code 200", async () => {

		const newUser = {
			username: "newuser",
			name: "New User",
			email: "newuser@example.com",
			phone: "1234567890",
			address: "123 Main Street",
			city: "Cityville",
			password: "password123",
		}

		const response = await request(server)
			.post("/api/users/register")
			.send(newUser)

		expect(response.statusCode).toBe(200)

		await executeQuery("DELETE FROM users WHERE username = $1", [newUser.username])
	})

	it("should return 400 if required fields are missing", async () => {

		const incompleteUser = {
			username: "incompleteuser",
			name: "Incomplete User",
			email: "incomplete@example.com",
			phone: "1234567890",
		}
		const response = await request(server)
			.post("/api/users/register")
			.send(incompleteUser)
		expect(response.statusCode).toBe(400)
	})
	it("returns status code 200 with image", async () => {
		const newUserWithImage = {
			username: "userwithimage",
			name: "User With Image",
			email: "userwithimage@example.com",
			phone: "1234567890",
			address: "123 Main Street",
			city: "Cityville",
			password: "password123",
			user_image: smallImageData
		}

		const response = await request(server)
			.post("/api/users/register")
			.field("username", newUserWithImage.username)
			.field("name", newUserWithImage.name)
			.field("email", newUserWithImage.email)
			.field("phone", newUserWithImage.phone)
			.field("address", newUserWithImage.address)
			.field("city", newUserWithImage.city)
			.field("password", newUserWithImage.password)
			.attach("user_image", newUserWithImage.user_image)

		expect(response.statusCode).toBe(200)

		await executeQuery("DELETE FROM users WHERE username = $1", [newUserWithImage.username])
	})
	it("should return 400 if username is missing", async () => {
		const userWithoutUsername = {
			name: "Missing Username",
			email: "missing@example.com",
			phone: "1234567890",
			password: "password123",
		}

		const response = await request(server)
			.post("/api/users/register")
			.send(userWithoutUsername)

		expect(response.statusCode).toBe(400)
	})


})



