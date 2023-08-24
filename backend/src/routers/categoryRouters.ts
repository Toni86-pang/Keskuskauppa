import express, { Request, Response } from "express"
import { Product, getAllCategories } from "../daos/productsDao"

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

export default category