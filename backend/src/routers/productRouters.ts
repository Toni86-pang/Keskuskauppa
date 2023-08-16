import express, { Request, Response } from "express"
import { createProduct, getAllProducts, Product } from "../daos/productsDao"


const product = express.Router()

product.get("/", async (_req: Request, res: Response) => {
	const result = await getAllProducts()
	return res.status(200).send(result.rows)
})
/*  			 Products endpoints 				  */
product.post("/", async (req, res) => {
	try {
		const newProduct: Product = req.body
		await createProduct(newProduct)
		res.status(201).json({ message: 'Product created successfully' })
	} catch (error) {
		res.status(500).json({ message: 'Error creating product' })
	}
})


export default product