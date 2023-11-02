import { executeQuery } from "../database"

export interface ProductBackend {
	product_id?: number
	user_id: number
	title: string
	category_id: number
	category_name?: string
	subcategory_id: number
	subcategory_name?: string
	city: string
	postal_code: string
	description: string
	price: number
	product_image?: Buffer | null | string
	listed: boolean
}

export async function createProduct(product: ProductBackend): Promise<{product_id: number}> {
	product.listed = true
	let query
	let values

	if (product.product_image) {
		query = `
            INSERT INTO Products
                (user_id, title, category_id, subcategory_id, description, price, product_image, postal_code, city, listed)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        	RETURNING product_id`

		values = [
			product.user_id,
			product.title,
			product.category_id,
			product.subcategory_id,
			product.description,
			product.price,
			product.product_image,
			product.postal_code,
			product.city,
			product.listed
		]
	} else {
		query = `
            INSERT INTO Products
                (user_id, title, category_id, subcategory_id, description, price, postal_code, city, listed)
            VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        	RETURNING product_id`
		values = [
			product.user_id,
			product.title,
			product.category_id,
			product.subcategory_id,
			product.description,
			product.price,
			product.postal_code,
			product.city,
			product.listed
		]
	}
	try {
		const result = await executeQuery(query, values)
		return result.rows[0]
	} catch (error) {
		console.error("Error creating product:", error)
		throw error
	}
}


export const getProductById = async (product_id: number): Promise<ProductBackend | null> => {
	const query = "SELECT * FROM products WHERE product_id = $1"
	const result = await executeQuery(query, [product_id])
  
	if (result.rows.length === 0) {
		return null
	}
  
	const productDetails: ProductBackend = result.rows[0]

	if (!(productDetails.product_image instanceof Buffer)) {
		// Handle cases where the product doesn't have an image
		productDetails.product_image = null
	}
  
	return productDetails
}
  
  

export const getAllProducts = async (): Promise<ProductBackend[]> => {
	const query = "SELECT * FROM products where listed = true ORDER BY created_at DESC"
	const result = await executeQuery(query)

	return result.rows

}

export const getLatestProducts = async (amount: number): Promise<ProductBackend[]> => {

	const query = `SELECT * FROM products 
				WHERE listed = true AND product_image IS NOT NULL
				ORDER BY created_at DESC
				LIMIT $1`
	
	const params = [amount]

	const result = await executeQuery(query, params)

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
	price: number,
	product_image: Buffer | null
): Promise<ProductBackend | null> => {
	let query
	let params
	
	if (product_image) {
		query = `UPDATE Products
                 SET title = $1, category_id = $2, subcategory_id = $3, city = $4,
                     postal_code = $5, description = $6, price = $7, product_image = $8
                 WHERE product_id = $9
                 RETURNING *`
		params = [title, category_id, subcategory_id, city, postal_code, description, price, product_image, product_id]
	} else {
		query = `UPDATE Products
                 SET title = $1, category_id = $2, subcategory_id = $3, city = $4,
                     postal_code = $5, description = $6, price = $7
                 WHERE product_id = $8
                 RETURNING *`
		params = [title, category_id, subcategory_id, city, postal_code, description, price, product_id]
	}
	const result = await executeQuery(query, params)
	if (result.rows.length === 0) {
		return null
	}
	return result.rows[0] as ProductBackend
}

export const updateProductListed = async (productId: number, isListed: boolean) => {
	const params = [productId, isListed]
	const query = "UPDATE Products SET listed = $2 WHERE product_id = $1 RETURNING *"
	const result = await executeQuery(query, params)
	if (result.rows.length === 0) {
		return null
	}
	return result.rows[0] as ProductBackend
}

export const getProductsByUserId = async (user_id: number) => {
	const query = "SELECT * FROM products WHERE user_id = $1 AND listed = true"
	const params = [user_id]
	const result = await executeQuery(query, params)
	return result.rows
}

//GET all categories
export const getAllCategories = async (): Promise<ProductBackend[]> => {
	const query = "SELECT * FROM Category"
	const result = await executeQuery(query)

	return result.rows
}

//GET all subcategories
export const getAllSubcategories = async (): Promise<ProductBackend[]> => {
	const query = "SELECT * FROM Subcategory"
	const result = await executeQuery(query)

	return result.rows
}

//GET individual subcategory
export const getIndividualSubcategory = async (category_id: number): Promise<ProductBackend[]> => {
	const query = "SELECT * FROM subcategory WHERE category_id = $1"
	const params = [category_id]
	const result = await executeQuery(query, params)
	return result.rows

}

// GET products by category
export const getProductsByCategory = async (category_ID: number): Promise<ProductBackend[]> => {
	const query = `
	SELECT
    products.product_id,
    products.title,
	products.price,
	products.product_image,
    category.category_id,
    category.category_name,
    subcategory.subcategory_id,
    subcategory.subcategory_name

	FROM products

	JOIN subcategory ON products.subcategory_id = subcategory.subcategory_id
	JOIN category ON subcategory.category_id = category.category_id
	
	WHERE category.category_id = $1 AND listed = true
	ORDER BY created_at DESC;`

	const result = await executeQuery(query, [category_ID])

	return result.rows
}
// GET products by subcategory
export const getProductsBySubcategory = async (subcategory_ID: number): Promise<ProductBackend[]> => {
	const query = `
	SELECT
	products.product_id,
	products.title,
	products.price,
	products.product_image,
	subcategory.subcategory_id,
	subcategory.subcategory_name,
	subcategory.category_id

	FROM products

	JOIN subcategory ON products.subcategory_id = subcategory.subcategory_id

	WHERE subcategory.subcategory_id = $1 AND listed = true
	ORDER BY created_at DESC;`
	
	const result = await executeQuery(query, [subcategory_ID])

	return result.rows
}

//GET category name
export const getCategoryName = async (categoryId: number) => {
	const query = "SELECT category_name FROM category WHERE category_id = $1"
	const params = [categoryId]
	const result = await executeQuery(query, params)
	return result.rows[0].category_name
}

//GET subcategory name
export const getSubcategoryName = async (subcategoryId: number) => {
	const query = "SELECT subcategory_name FROM subcategory WHERE subcategory_id = $1"
	const params = [subcategoryId]
	const result = await executeQuery(query, params)
	return result.rows[0].subcategory_name
}

// GET search products
export const searchProducts =async (searchQuery: string): Promise<ProductBackend[]>  => {
	try {
		const query = ` 
		SELECT * FROM products
		WHERE title ILIKE $1 AND listed = true;
		`
		const result = await executeQuery(query, [`%${searchQuery}%`])
		return result.rows
	} catch (error) {
		console.error(error)
		throw new Error("Error searching for products.")
	}
}