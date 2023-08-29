import express from "express"
import { Product, getAllCategories, getAllSubcategories } from "../daos/productsDao"

const category = express.Router()

//Get all categories
category.get("/", async (_req, res) => {
	try {
		const category: Product[] = await getAllCategories()
		res.status(200).json(category)
	} catch (error) {
		res.status(500).json({ message: "Category information couldn't be displayed" })
	}
})

//Get all subcategories
category.get("/subcategory", async (_req, res) => {
	try {
		const category: Product[] = await getAllSubcategories()
		res.status(200).json(category)
	} catch (error) {
		res.status(500).json({ message: "Subcategory information couldn't be displayed" })
	}
})

export default category