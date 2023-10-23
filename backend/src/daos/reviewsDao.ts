import { executeQuery } from "../database"

interface Review {
	sales_id: number
	seller_id: number
	buyer_id: number
	description: string
	seen?: boolean
	stars:number
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