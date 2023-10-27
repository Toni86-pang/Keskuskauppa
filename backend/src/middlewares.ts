import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

// interface CustomRequest extends Request {
//     username?: string
//     name?: string
//     email?: string
//     phone?: string
//     address?: string
//     city?: string
//     password: string
//     id: number
//     isAdmin?: boolean
// }

interface CustomRequest extends Request {
    username?: string
    id?: number
    isAdmin?: boolean
}


const secret = process.env.SECRET ?? ""

export const authentication = (req: CustomRequest, res: Response, next: NextFunction) => {
	const auth = req.get("Authorization")
	if (!auth?.startsWith("Bearer ")) {
		console.error("Invalid token")
		return res.status(401).send("Invalid token")
	}
	const token = auth.substring(7)

	try {
		const decodedToken = jwt.verify(token, secret) as CustomRequest

		if (decodedToken?.id) {
			req.username = decodedToken.username
			req.id = decodedToken.id
			next()
		} else {
			console.log("Insufficient permissions")
			return res.status(401).send("Insufficient permissions")
		}
	} catch (error) {
		console.log("Token error")
		return res.status(401).send("Invalid token")
	}
}

export const checkReqBody = (req: Request, res: Response, next: NextFunction) => {
	console.log(req.body)

	if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
		return res.status(400).send({ error: "Missing request body." })
	}

	console.log("Ok")


	next()
}

export const logger = (req: Request, _res: Response, next: NextFunction): void => {
	const date = new Date()
	const padNumbers = (value: string | number): string => String(value).padStart(2, "0")
	const dateStr = `${padNumbers(date.getHours())}:${padNumbers(date.getMinutes())}:${padNumbers(date.getSeconds())}`
	const method = req.method
	const host = req.headers.host ?? ""
	const url = new URL(req.url, `http://${host}`)
	const body = req.body as JSON
	console.log(`${dateStr} ${method}\t${url.pathname}\t`, body)
	next()
}

export const isUserAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
	if (!req.isAdmin) {
		return res.status(403).json({ error: "Forbidden" })
	}
	next()
}

export const unknownEndpoint = (req: Request, res: Response): void => {
	const host = req.headers.host ?? ""
	const url = new URL(req.url, `http://${host}`)
	res.status(404).json({ error: `Endpoint ${url.pathname} does not exist` })
}

export const validateUserData = (req: CustomRequest, res: Response, next: NextFunction) => {
	const expectedTypes: Record<string, string> = {
		username: "string",
		name: "string",
		email: "string",
		phone: "string",
		address: "string",
		city: "string",
		password: "string",
		id: "number",
		isAdmin: "boolean"
	}

	for (const key in expectedTypes) {
		if (req.body[key] && typeof req.body[key] !== expectedTypes[key]) {
			return res.status(400).json({ error: "Virheelliset käyttäjätiedot" })
		}
	}

	next()
}

//Validate category
export const validateCategoryId = (req: Request, res: Response, next: NextFunction) => {
	const category_Id = req.params.id

	if(!(Number(category_Id))){
		return res.status(400).json({ message: "Invalid category ID format"})
	}
	if(!Number.isInteger(Number(category_Id))){
		return res.status(400).json({ message: "Category ID must be an integer"})
	}

	next()
}
