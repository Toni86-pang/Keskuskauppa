import express, { Request, Response } from "express"
import { authentication } from "../middlewares"
import { createReview } from "../daos/reviewsDao"


interface CustomRequest extends Request {
	id?: number
}

const review = express.Router()

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