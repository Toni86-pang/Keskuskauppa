import express, { Request, Response } from "express"
import { createProduct , Product } from "../daos/productsDao"


const product = express.Router()


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