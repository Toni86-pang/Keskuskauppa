import { executeQuery } from "./database"

export interface Product {
    user_ID: number
    title: string
    category_ID: number
    subcategory_ID: number
    location: string
    description: string
    price: number
    product_image: Buffer
  }

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
	  await executeQuery(query, values)
	} catch (error) {
	  console.error('Error creating product:', error)
	  throw error
	}
  }

export const getAllUsers = async () => {
	const query = "SELECT * FROM users"
	const result = await executeQuery(query)
	return result
}