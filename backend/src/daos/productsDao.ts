import { executeQuery } from "../database"

export interface Product {
	product_id: number
	user_id: number
	title: string
	category_id: number
	category_name: string
	subcategory_id: number
	subcategory_name: string
	city: string
	postal_code: string
	description: string
	price: number
	product_image: Buffer
}

export async function createProduct(product: Product): Promise<void> {
	const query = `
	  INSERT INTO Products
		(user_id, title, category_id, subcategory_id, location, description, price, product_image)
	  VALUES
		($1, $2, $3, $4, $5, $6, $7, $8)
	`
	const values = [
		product.user_id,
		product.title,
		product.category_id,
		product.subcategory_id,
		product.city,
		product.postal_code,
		product.description,
		product.price,
		product.product_image,
	]

	try {
		await executeQuery(query, values)
	} catch (error) {
		console.error("Error creating product:", error)
		throw error
	}
}

export const getProductById = async (product_id: number): Promise<Product | null> => {
	const query = " SELECT * FROM products WHERE product_id = $1"
	const result = await executeQuery(query, [product_id])

	if (result.rows.length === 0) {
		return null
	}
	const productDetails: Product = result.rows[0]
	return productDetails
}

export const getAllProducts = async (): Promise<Product[]> => {
	const query = "SELECT * FROM products"
	const result = await executeQuery(query)

	return result.rows

}

export const deleteProduct = async (product_id: number) => {
	const query = "DELETE FROM products WHERE product_id = $1"
	const params = [product_id]
	const result = await executeQuery(query, params)
	return result
}

export const updateProductData = async (
	product_id: number,
	title: string,
	category_id: number,
	subcategory_id: number,
	city: string,
	postal_code: string,
	description: string,
	price: number
): Promise<Product | null> => {
	const params = [title, category_id, subcategory_id, city,postal_code, description, price, product_id]
	const query =
		"UPDATE Products SET title = $1, category_id = $2, subcategory_id = $3, location = $4, description = $5, price = $6 WHERE product_id = $7 RETURNING * "
	const result = await executeQuery(query, params)
	if (result.rows.length === 0) {
		return null
	}
	return result.rows[0] as Product
}

//GET all categories
export const getAllCategories = async (): Promise<Product[]> => {
	const query = "SELECT * FROM Category"
	const result = await executeQuery(query)

	return result.rows
}

//GET all subcategories
export const getAllSubcategories = async (): Promise<Product[]> => {
	const query = "SELECT * FROM Subcategory"
	const result = await executeQuery(query)

	return result.rows
}

//GET individual subcategory
export const getIndividualSubcategory = async (category_id: number): Promise<Product[]> => {
	const query = "SELECT * FROM subcategory WHERE category_id = $1"
	const params = [category_id]
	const result = await executeQuery(query, params)
	return result.rows

}

// GET products by category
export const getProductsByCategory = async (category_ID: number): Promise<Product[]> => {
	const query = `
	SELECT
    products.product_id,
    products.title,
    category.category_id,
    category.category_name,
    subcategory.subcategory_id,
    subcategory.subcategory_name

	FROM products

	JOIN subcategory ON products.subcategory_id = subcategory.subcategory_id
	JOIN category ON subcategory.category_id = category.category_id
	
	WHERE category.category_id = $1;`

	const result = await executeQuery(query, [category_ID])

	return result.rows
}
// GET products by subcategory
export const getProductsBySubcategory = async (subcategory_ID: number): Promise<Product[]> => {
	const query = `
	SELECT
	products.product_id,
	products.title,
	subcategory.subcategory_id,
	subcategory.subcategory_name,
	subcategory.category_id

	FROM products

	JOIN subcategory ON products.subcategory_id = subcategory.subcategory_id

	WHERE subcategory.subcategory_id = $1;`
	
	const result = await executeQuery(query, [subcategory_ID])

	return result.rows
}
