import express, { Request, Response } from "express"
import { getAllUsers, addUser, deleteUser, getUserByUsername, findUserByUSername, findUserByEmail, getUserByUserId, updateProfile, getUserDetailsByUserId } from "../daos/usersDao"
import { authentication, checkReqBody } from "../middlewares"
import multer from "multer"
import argon2 from "argon2"
import jwt from "jsonwebtoken"
import multer from "multer"
import { User } from "../daos/usersDao"
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const secret = process.env.SECRET ?? ""
const users = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

users.get("/", async (_req: Request, res: Response) => {
	const result = await getAllUsers()
	return res.status(200).send(result.rows)
})

// profiilisivu vaati get user by userId.  --Nisu

interface CustomRequest extends Request {
	id?: number
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
users.post("/register", upload.single("user_image"), async (req: Request, res: Response) => {
	try {
		const { username, name, email, phone, address, city, postal_code, password } = req.body
		let user_image: Buffer | undefined

		if (req.file) {
			user_image = req.file.buffer
		}

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

		//Hash password and add user in database
		const hashedPassword = await argon2.hash(password)
		const userId = await addUser({
			username,
			name,
			email,
			phone,
			address,
			city,
			postal_code,
			password: hashedPassword,
			user_image
		})
		const token = jwt.sign({ username, id: userId }, secret)
		return res.status(200).send(token)

	} catch (error) {
		console.error("Error creating user", error)
		return res.status(500).send("Internal server error")
	}
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

users.put("/update",  authentication, upload.single("user_image"),async (req: CustomRequest, res: Response) => {
	let user_image: Buffer | undefined

	if (req.file) {
		user_image = req.file.buffer
	}

	const userId = req.id

	if (!userId) {
		console.log("no user id")
		return res.status(404).send("No user id")
	}

	const updatedUser: User = req.body
	updatedUser.user_id = userId

	if (user_image !== undefined) {
		updatedUser.user_image = user_image
	} else {
		updatedUser.user_image = undefined
	}

	try {
		const result = await updateProfile(updatedUser)
		if (result) {
			res.status(200).send("Updated successfull!")
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

//GET user details by user_id
users.get("/:id", async (req: Request, res: Response) => {
	try {
		const userId = Number(req.params.id)
		if (isNaN(userId)) {
			return res.status(400).json({ message: "Invalid user id provided" })
		}
		const result = await getUserDetailsByUserId(userId)
		return res.status(200).send(result)
	} catch (error) {
		res.status(500).json({ message: "User information couldn't be displayed" })
	}
})

export default users