import express, { Request, Response } from "express"
import { getAllUsers, addUser, deleteUser } from "../daos/usersDao"
import argon2 from "argon2"
import jwt from "jsonwebtoken"

const secret = process.env.SECRET ?? ""
const options = { expiresIn: "15min" }

const users = express.Router()

users.get("/", async (_req: Request, res: Response) => {
	const result = await getAllUsers()
	return res.status(200).send(result.rows)
})

// `POST /users` REGISTER a new user
users.post("/register", async (req: Request, res: Response) => {
	const { username, name, email, phone, address, city, password } = req.body

	//Check if username or password are missing
	if (!username || !name || !email || !phone || !password) {
		return res.status(400).send("Missing username or password.")
	}

	//Create token
	const token = jwt.sign(username, secret, options)

	//Hash password and add user in database
	const hashedPassword = await argon2.hash(password)
	await addUser(username, name, email, phone, address, city, hashedPassword)
	return res.status(200).send(token)
})

users.delete("/delete/:user_id", async (req: Request, res: Response) => {
	const user_id = Number(req.params.user_id)

	try {
		const result = await deleteUser(user_id)

		if (result.rowCount > 0) {
			return res.status(200).send("Dobby never meant to kill. Dobby only meant to maim, or seriously injure.")
		} else {
			return res.status(404).send("There is no that user_id")
		}
	} catch (error) {
		console.error(error)
		return res.status(500).send("Avada kedavra!")
	}
})

export default users