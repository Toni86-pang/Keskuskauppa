import { executeQuery } from "../database"

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

interface AverageStars {
	average_score: number
}

export const getReviewsByUserId = async (userId: number): Promise<Review[]> => {
	const query = "SELECT * FROM reviews WHERE seller_id = $1 ORDER BY review_date DESC"
	const result = await executeQuery(query, [userId])
	const reviews: Review[] = result.rows
	return reviews
}

export const getReviewById = async (reviewId: number): Promise<Review | null> => {
	const query = "SELECT * FROM reviews WHERE review_id = $1"
	const result = await executeQuery(query, [reviewId])
	if (result.rows.length === 0) {
		return null
	}
	else {
		const review: Review = result.rows[0]
		return review
	}

}

export const getAverageStarsByUserId = async (userId: number): Promise<AverageStars> => {
	const query = "SELECT AVG(stars) AS average_score FROM reviews 	WHERE seller_id = $1"
	const result = await executeQuery(query, [userId])
	return result.rows[0]
	
}


export async function createReview(review: Review): Promise<Review> {
	const query = `
            INSERT INTO Reviews
                (sales_id, seller_id, buyer_id, description, stars)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING *
        `
	const params = [
		review.sales_id,
		review.seller_id,
		review.buyer_id,
		review.description,
		review.stars
	]

	try {
		const result = await executeQuery(query, params)
		return result.rows[0]
	} catch (error) {
		console.error("Error creating product:", error)
		throw error
	}
}

export const postComment = async (review_id: number, comment: string) => {
	const query = `INSERT INTO comment
				(review_id, comment)
				VALUES ($1, $2)
			`
	const params = [review_id, comment]

	try {
		const result = await executeQuery(query, params)
		return result.rows[0]

	} catch (error) {
		console.error("Error creating comment:", error)
		throw error
	}
}

export const getReviewComment = async (reviewId: number): Promise<ReviewComment | null > => {
	const query = "SELECT * FROM comment WHERE review_id = $1"
	const params = [reviewId]

	const result = await executeQuery(query, params)
	if (result.rowCount > 0) {
		return result.rows[0]
	}

	return null
}
