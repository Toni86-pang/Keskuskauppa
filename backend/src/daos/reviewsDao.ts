import { executeQuery } from "../database"

interface Review {
	review_id: number
	sales_id: number
	seller_id: number
	buyer_id: number
	description: string
	review_date: string
	seen: boolean
	stars: number
}

export const getReviewsByUserId = async (userId: number): Promise<Review[]> => {
	const query = "SELECT * FROM reviews WHERE user_id = $1"
	const result = await executeQuery(query, [userId])
	const reviews: Review[] = result.rows
	return reviews
}

export const getReviewById = async (reviewId: number): Promise<Review> => {
	const query = "SELECT * FROM reviews WHERE review_id = $1"
	const result = await executeQuery(query, [reviewId])
	const review: Review = result.rows[0]
	return review
}

export const getAverageStarsByUserId = async (userId: number): Promise<number> => {
	const query = "SELECT AVG(stars) AS average_score FROM reviews 	WHERE user_id = $1"
	const result = await executeQuery(query, [userId])
	return result.rows[0]
}




