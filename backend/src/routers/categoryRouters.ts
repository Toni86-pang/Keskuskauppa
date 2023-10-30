import express from "express"
import { ProductBackend, getAllCategories, getAllSubcategories, getIndividualSubcategory, getCategoryName, getSubcategoryName } from "../daos/productsDao"

const category = express.Router()

//Get all categories
category.get("/", async (_req, res) => {
	try {
		const category: ProductBackend[] = await getAllCategories()
		res.status(200).json(category)
	} catch (error) {
		res.status(500).json({ message: "Category information couldn't be displayed" })
	}
})

//Get all subcategories
category.get("/subcategory", async (_req, res) => {
	try {
		const category: ProductBackend[] = await getAllSubcategories()
		res.status(200).json(category)
	} catch (error) {
		res.status(500).json({ message: "Subcategory information couldn't be displayed" })
	}
})

//Get subcategories associated to a certain category
category.get("/subcategory/:category_id", async (req, res) => {
	const category_id = parseInt(req.params.category_id)
	try {
		const subcategories: ProductBackend[] = await await getIndividualSubcategory(category_id)
		res.status(200).json(subcategories)
	} catch (error) {
		res.status(500).json({ message: "Subcategory information couldn't be displayed" })
	}
})

//Get category name by category id
category.get("/categoryname/:categoryId", async (req, res) => {
	const categoryId = Number(req.params.categoryId)
	try {
		const categoryName = await getCategoryName(categoryId)
		res.status(200).send(categoryName)
	} catch (error) {
		res.status(500).json({ message: "Category name could not be fetched" })
	}
})

//Get subcategory name by category id
category.get("/subcategoryname/:subcategoryId", async (req, res) => {
	const subcategoryId = Number(req.params.subcategoryId)
	try {
		const categoryName = await getSubcategoryName(subcategoryId)
		res.status(200).send(categoryName)
	} catch (error) {
		res.status(500).json({ message: "Category name could not be fetched" })
	}
})



export default category