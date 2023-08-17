import { executeQuery } from "../database"

export interface Product {
	product_ID: number
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

export const getProductById = async (product_ID: number): Promise<Product | null> => {
	try {
		const query = " SELECT * FROM products WHERE product_ID = $1"
		const result = await executeQuery(query, [product_ID])

		if (result.rows.length === 0) {
			return null
		}
		const productDetails: Product = result.rows[0]
		return productDetails
	} catch (error) {
		throw error
	}

}

export const getAllProducts = async (): Promise<Product[]> => {
	try {
		const query = "SELECT * FROM products"
		const result = await executeQuery(query)

		return result.rows
	} catch (error) {
		throw error
	}
}

export const deleteProduct = async (product_ID: number) => {
	const query = 'DELETE FROM products WHERE product_ID = $1'
	const params = [product_ID]
	const result = await executeQuery(query, params)
	return result
}

export const updateProductData = async (
	productID: number,
	title: string,
	categoryID: number,
	subcategoryID: number,
	location: string,
	description: string,
	price: number
): Promise<Product | null> => {
	try {
		const params = [title, categoryID, subcategoryID, location, description, price, productID];
		const query =
			"UPDATE Products SET title = $1, category_ID = $2, subcategory_ID = $3, location = $4, description = $5, price = $6 WHERE product_ID = $7 RETURNING * ";

		const result = await executeQuery(query, params);

		if (result.rows.length === 0) {
			return null;
		}
		return result.rows[0] as Product;
	} catch (error) {
		throw error;
	}
};

