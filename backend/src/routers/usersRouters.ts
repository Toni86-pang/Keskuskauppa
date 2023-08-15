import express, { Request, Response } from "express"
import { getAllUsers, addUser } from "../daos/usersDao"
import argon2 from "argon2"
import jwt from "jsonwebtoken"

const secret = process.env.SECRET ?? ""

const users = express.Router()

users.get("/", async (_req: Request, res: Response) => {
	const result = await getAllUsers()
	return res.status(200).send(result)
})

// `POST /users` REGISTER a new user
users.post("/register", async (req: Request, res: Response) => {
        const { username, name, email, phone, address, city, password } = req.body

        //Check if username or password are missing
        if (!username || !name || !email || !phone || !password) {
            return res.status(400).send("Missing username or password.")
        }

        //Create token
        const token = jwt.sign(username, secret)

        //Hash password and add user in database
        const hashedPassword = await argon2.hash(password)
        await addUser(username, name, email, phone, address, city, hashedPassword)
        return res.status(200).send(token)
})

export default users