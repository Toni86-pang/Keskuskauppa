import express, { Request, Response } from "express"
import { getReviewsByUserId, getReviewById, getAverageStarsByUserId, createReview, postComment, getReviewComment, markReviewsSeen } from "../daos/reviewsDao"
import { authentication } from "../middlewares"


interface CustomRequest extends Request {
	id?: number
}

interface Review {
	review_id?: number
	sales_id: number
	seller_id: number
	buyer_id: number
	description: string
	review_date?: string
	seen?: boolean
	stars: number
}

interface ReviewComment {
	comment_id?: number
	review_id: number
	comment: string
}

const review = express.Router()

review.get("/user/:id", async (req: Request, res: Response) => {

	const userId = Number(req.params.id)
	try {
		const result: Review[] = await getReviewsByUserId(userId)
		return res.status(200).send(result)
	} catch (error) {
		console.error("Error fetching reviews: ", error)
		res.status(500).send(error)
	}
	
})

review.get("/own", authentication, async (req: CustomRequest, res: Response) => {

	const userId = req.id
	console.log("UserId:", userId)
	if (!userId) {
		console.error("No user found")
		return res.status(401).send()
	}
	try {
		const result: Review[] | null = await getReviewsByUserId(userId)
		markReviewsSeen(userId)
		if (result) {
			console.log("Result: ", result)
			return res.status(200).send(result)
		} else {
			return res.status(404).send()
		}		
	} catch (error) {
		console.error("Error fetching reviews: ", error)
		res.status(500).send(error)
	}	
})


review.get("/:id", async (req: Request, res: Response) => {

	const reviewId = Number(req.params.id)
	try {
		const result: Review | null = await getReviewById(reviewId)
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


review.post("/comment/", authentication, async (req: CustomRequest, res: Response) => {
	const sellerId = req.id
	const { review_id, comment}: ReviewComment = req.body
	try {
		const review = await getReviewById(review_id)
		const existingComment = await getReviewComment(review_id)
		
		if (review?.seller_id !== sellerId) {
			return res.status(403).send("Not the seller.")
		}

		if (existingComment) {
			return res.status(403).send("Only one comment allowed.")
		}		
		await postComment(review_id, comment)
		res.status(201).send()
	} catch (error){
		res.status(500).send("Error posting message: " + error)
	}
})

review.get("/comment/:reviewId", async (req: Request, res: Response) => {
	const reviewId = Number(req.params.reviewId)

	try {
		const comment: ReviewComment | null = await getReviewComment(reviewId)
		return res.status(200).send(comment)
				
	} catch (error) {
		console.error("Error fetching comment: ", error)
		res.status(500).send("Error fetching comment: " + error)
	}
})



export default review
