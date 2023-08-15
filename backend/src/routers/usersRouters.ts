import express, { Request, Response } from "express"
import { getAllUsers } from "../dao"

const users = express.Router()

users.get("/", async (_req: Request, res: Response) => {
	const result = await getAllUsers()
	return res.status(200).send(result)
})

export default users