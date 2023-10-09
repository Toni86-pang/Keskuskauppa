import express from "express"
import { searchProducts,Product  } from "../daos/productsDao"

const search = express.Router()

search.get("/", async (req, res) => {
	const searchQuery = req.query.query as string
	try {
		if(typeof searchQuery !== "string" || !searchQuery.trim()){
			return res.status(400).json({error: "Search query is required"})
		}
		const products: Product[] = await searchProducts (searchQuery)
		res.status(200).json(products)
	} catch (error){
		console.error(error)
		res.status(500).json({error: "An error occurred on searchquery"})
	}
})

export default search


