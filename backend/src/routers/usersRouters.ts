import express, { Request, Response } from "express"
import { getAllUsers, addUser, deleteUser, getUserByUsername, findUserByUSername, findUserByEmail, getUserByUserId, updateProfile } from "../daos/usersDao"
import { authentication, checkReqBody } from "../middlewares"
import argon2 from "argon2"
import jwt from "jsonwebtoken"

//Maaret täällä rettelöi

interface Profile {
	email: string
	phone: string
	address: string
	city: string
	postal_code: string
}

const secret = process.env.SECRET ?? ""
const users = express.Router()

users.get("/", async (_req: Request, res: Response) => {
	const result = await getAllUsers()
	return res.status(200).send(result.rows)
})

// profiilisivu vaati get user by userId.  --Nisu

interface CustomRequest extends Request {
	username?: string
	id?: number
	isAdmin?: boolean
}

users.get("/user", authentication, async (req: CustomRequest, res: Response) => {
	if (!req.id) {
		return res.status(404).send("No such user")
	}
	const user_id = req.id
	const result = await getUserByUserId(user_id)
	return res.status(200).send(result)
})

// `POST /users` REGISTER a new user
users.post("/register", async (req: Request, res: Response) => {
	const { username, name, email, phone, address, city, password } = req.body

	//Check if username or password are missing
	if (!username || !name || !email || !phone || !password) {
		return res.status(400).send("Required information is missing.")
	}

	//Check username is not already in use
	const userExists = await findUserByUSername(username)

	if (userExists.rows.length === 1) {
		return res.status(401).send("An account with this username already exists.")
	}

	//Check email is not already in use
	const emailExists = await findUserByEmail(email)

	if (emailExists.rows.length === 1) {
		return res.status(401).send("An account with this email already exists.")
	}

	//Create token
	const token = jwt.sign(username, secret)

	//Hash password and add user in database
	const hashedPassword = await argon2.hash(password)
	await addUser(username, name, email, phone, address, city, hashedPassword)
	return res.status(200).send(token)
})

users.delete("/delete", authentication, async (req: CustomRequest, res: Response) => {
	const user_id = Number(req.id)

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

users.post("/login", checkReqBody, async (req: Request, res: Response) => {

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
		const userId = result.user_id
		const token = jwt.sign({ username, id: userId }, secret)
		return res.status(200).send({ token })

	} catch (error) {
		console.error("Error:", error)
		return res.status(500).send({ error: "Internal server error." })
	}
})

users.put("/update", authentication, async (req: CustomRequest, res: Response) => {

	if (!req.id) {
		console.log("no req.id")
		return res.status(404).send("No user id")
	}
	const user_id = req.id

	const updatedProfile: Profile = req.body
	try {
		const result = await updateProfile(
			user_id,
			updatedProfile.email,
			updatedProfile.phone,
			updatedProfile.address,
			updatedProfile.city,
			updatedProfile.postal_code
		)

		if (result) {
			res.status(200).send()
		} else {
			res.status(404).send("Profile not found")
		}

	} catch (error) {
		console.error("Error updating user profile:", error)
		res.status(500).send("Internal Server Error")
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