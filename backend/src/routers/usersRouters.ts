import express, { Request, Response } from "express"
import { getAllUsers, addUser, deleteUser, getUserByUsername, findUserByUSername, findUserByEmail } from "../daos/usersDao"
import { checkReqBody } from "../middlewares"
import argon2 from "argon2"
import jwt from "jsonwebtoken"



const secret = process.env.SECRET ?? ""
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
		return res.status(400).send('Required information is missing.')
	}

	//Check username is not already in use
	const userExists = await findUserByUSername(username)

	if (userExists.rows.length === 1) {
		return res.status(401).send('An account with this username already exists.')
	}

	//Check email is not already in use
	const emailExists = await findUserByEmail(email)

	if (emailExists.rows.length === 1) {
		return res.status(401).send('An account with this email already exists.')
	}

	//Create token
	const token = jwt.sign(username, secret)

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

users.post('/login', checkReqBody, async (req: Request, res: Response) => {

	const { username, password } = req.body
	if (!username || !password) {
		return res.status(400).send({ error: "Missing username or password." })
	}

	try {
		const result = await getUserByUsername(username)

		if (!result || result.username !== username) {
			return res.status(401).send({ error: "Username not found." })
		}
		console.log(result.password)
		const isPasswordCorrect = await argon2.verify(result.password, password)
		if (!isPasswordCorrect) {
			return res.status(401).send({ error: "Incorrect password." })
		}

		const token = jwt.sign({ username }, secret)
		return res.status(200).send({ token })

	} catch (error) {
		console.error("Error:", error)
		return res.status(500).send({ error: "Internal server error." })
	}
})
/*
users.put("/logout", async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"]
  if (authHeader === undefined) return res.status(401).send("You are not logged in")

  jwt.sign(authHeader, '', { expiresIn: 1 }, (logout, err) => {
	if (logout) {
	  res.send("Succeed! Logged out")
	} else {
	  res.send("Something gone wrong")
	}
  })
})
*/

export default users