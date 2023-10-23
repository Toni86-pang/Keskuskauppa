import express, { Request, Response } from "express"
import { getReviewsByUserId, getReviewById, getAverageStarsByUserId } from "../daos/reviewsDao"
// import { authentication } from "../middlewares"


// interface CustomRequest extends Request {
// 	id?: number
// }

const reviews = express.Router()

reviews.get("/user/:id", async (req: Request, res: Response) => {

	const userId = Number(req.params.id)
	try {
		const result = await getReviewsByUserId(userId)
		return res.status(200).send(result)
	} catch (error) {
		console.error("Error fetching reviews: ", error)
		res.status(500).send(error)
	}
	
})


reviews.get("/:id", async (req: Request, res: Response) => {

	const reviewId = Number(req.params.id)
	try {
		const result = await getReviewById(reviewId)
		return res.status(200).send(result)
	} catch (error) {
		console.error("Error fetching review: ", error)
		res.status(500).send(error)
	}	
})

reviews.get("/user/average/:id", async (req: Request, res: Response) => {

	const userId = Number(req.params.id)
	try {
		const result = await getAverageStarsByUserId(userId)
		return res.status(200).send(result)
	} catch (error) {
		console.error("Error fetching reviews: ", error)
		res.status(500).send(error)
	}	
})

export default reviews