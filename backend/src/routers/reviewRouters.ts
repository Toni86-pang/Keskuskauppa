import express, { Request, Response } from "express"
import { getReviewsByUserId, getReviewById, getAverageStarsByUserId, createReview } from "../daos/reviewsDao"
import { authentication } from "../middlewares"


interface CustomRequest extends Request {
	id?: number
}

const review = express.Router()

review.get("/user/:id", async (req: Request, res: Response) => {

	const userId = Number(req.params.id)
	try {
		const result = await getReviewsByUserId(userId)
		return res.status(200).send(result)
	} catch (error) {
		console.error("Error fetching reviews: ", error)
		res.status(500).send(error)
	}
	
})


review.get("/:id", async (req: Request, res: Response) => {

	const reviewId = Number(req.params.id)
	try {
		const result = await getReviewById(reviewId)
		if (result) {
			console.log("Result: ", result)
			return res.status(200).send(result)
		} else {
			return res.status(404).send()
		}		
	} catch (error) {
		console.error("Error fetching review: ", error)
		res.status(500).send(error)
	}	
})

review.get("/user/average/:id", async (req: Request, res: Response) => {

	const userId = Number(req.params.id)
	try {
		const result = await getAverageStarsByUserId(userId)
		return res.status(200).send(result)
	} catch (error) {
		console.error("Error fetching reviews: ", error)
		res.status(500).send(error)
	}	
})


review.post("/", authentication, async (req: CustomRequest, res: Response) => {
	const buyer_id = req.id
	try {
		const { sales_id,
			seller_id,
			description,
			stars } = req.body
		console.log(sales_id,
			seller_id,
			buyer_id,
			description,
			stars)
		if (!sales_id || !seller_id || !buyer_id || !description || !stars) {
			return res.status(400).send("Required information is missing.")
		}
		await createReview({ 
			sales_id,
			seller_id,
			buyer_id,
			description,
			stars
		})
		res.status(201).json({ message: "Review created successfully" })
	} catch (error) {
		res.status(500).json({ message: "Error creating review" })
	}
})

export default review
