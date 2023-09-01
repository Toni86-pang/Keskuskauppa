import express from "express"
import { Product, getAllCategories, getAllSubcategories, getIndividualSubcategory } from "../daos/productsDao"

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

//Get subcategories associated to a certain category
category.get("/subcategory/:category_id", async (req, res) => {
	const category_id = parseInt(req.params.category_id)
	try {
		const subcategories: Product[] = await await getIndividualSubcategory(category_id)
		res.status(200).json(subcategories)
	} catch (error) {
		res.status(500).json({ message: "Subcategory information couldn't be displayed" })
	}
})


export default category