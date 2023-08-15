import { Pool } from "pg"
import { Product } from "./Product"

const pool = new Pool(/* Your database configuration */)

export async function createProduct(product: Product): Promise<void> {
	const query = `
    INSERT INTO Products
      (user_ID, title, category_ID, subcategory_ID, location, description, price, product_image)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
  `
	const values = [
		product.user_ID,
		product.title,
		product.category_ID,
		product.subcategory_ID,
		product.location,
		product.description,
		product.price,
		product.product_image,
	]

	try {
		await pool.query(query, values)
	} catch (error) {
		console.error("Error creating product:", error)
		throw error
	}
}
