import express from "express"
import { createProduct } from "../productDao"
import { Product } from "../Product"

const router = express.Router()

router.post("/products", async (req, res) => {
	try {
		const newProduct: Product = req.body
		await createProduct(newProduct)
		res.status(201).json({ message: "Product created successfully" })
	} catch (error) {
		res.status(500).json({ message: "Error creating product" })
	}
})

export default router
