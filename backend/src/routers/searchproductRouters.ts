import express from "express"
import { searchProducts,ProductBackend } from "../daos/productsDao"

interface ProductFrontend {
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
	product_image?: string
	listed: boolean
}

const search = express.Router()

search.get("/", async (req, res) => {
	const searchQuery = req.query.query as string
	try {
		if(typeof searchQuery !== "string" || !searchQuery.trim()){
			return res.status(400).json({error: "Search query is required"})
		}
		const products: ProductBackend[] = await searchProducts (searchQuery)

		const productsFront: ProductFrontend[] = []

		products.forEach((product) => {
			if (product.product_image instanceof Buffer) {
				const tempProductImage = "data:image/*;base64," + product?.product_image.toString("base64")
				productsFront.push({...product, product_image: tempProductImage})
			} else {
				productsFront.push({...product, product_image: ""})
			}
		})

		res.status(200).json(productsFront)
	} catch (error){
		console.error(error)
		res.status(500).json({error: "An error occurred on searchquery"})
	}
})

export default search


