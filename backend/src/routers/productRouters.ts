import express, { Request, Response } from "express"
import { createProduct, getAllProducts, getProductById, getProductsByCategory, getProductsBySubcategory, updateProductData, deleteProduct, Product } from "../daos/productsDao"


const product = express.Router()

interface CustomRequest extends Request {
	logged_in?: boolean
	user_id?: number
}

/*  			 Products endpoints 				  */
product.post("/", async (req, res) => {
	try {
		const newProduct: Product = req.body
		await createProduct(newProduct)
		res.status(201).json({ message: "Product created successfully" })
	} catch (error) {
		res.status(500).json({ message: "Error creating product" })
	}
})

product.get("/", async (_req, res) => {
	try {
		const product: Product[] = await getAllProducts()
		res.status(200).json(product)
	} catch (error) {
		res.status(500).json({ message: "you shouldn't even be here?" })
	}
}


)

product.get("/:id", async (req, res) => {
	try {
		const ProductID: number = parseInt(req.params.id, 10)
		const productDetails: Product | null = await getProductById(ProductID)
		if (productDetails === null) {
			res.status(404).json({ message: " product not found" })
		} else {
			res.status(200).json(productDetails)
		}
	} catch (error) {
		res.status(500).json({ message: "why are you still here?" })
	}
})


product.delete("/delete/:id", async (req: Request, res: Response) => {
	const product_id = Number(req.params.id)

	try {
		const result = await deleteProduct(product_id)

		if (result.rowCount > 0) {
			return res.status(200).send("Lets go boss!")
		} else {
			return res.status(404).send("no products to delete")
		}
	} catch (error) {
		console.error(error)
		return res.status(500).send("You should leave?")
	}
})


product.put("/:id", async (req: CustomRequest, res: Response) => {
	const product_Id = parseInt(req.params.id, 10)
	const updatedProductData = req.body
	try {
		const updateProduct: Product | null = await updateProductData(
			product_Id,
			updatedProductData.title,
			updatedProductData.category_ID,
			updatedProductData.subcategory_ID,
			updatedProductData.location,
			updatedProductData.description,
			updatedProductData.price
		)
		if (updateProduct) {
			res.status(200).json({ message: "product update is complete", updateProduct })
		} else {
			res.status(404).json({ message: "product not found" })
		}
	} catch (error) {
		console.error("Error updating product:", error)
		res.status(500).send("Internal Server Error")
	}
})
//Serve products by category
product.get("/category/:id", async (req, res) => {
	const categoryId = parseInt(req.params.id)
	try {
		const products: Product[] = await getProductsByCategory(categoryId)
		res.status(200).json(products)
	} catch (error) {
		res.status(500).json({ message: "Product information couldn't be displayed" })
	}
})
// Serve products by subcategory
product.get("/subcategory/:id", async (req, res) => {
	const subcategoryId = parseInt(req.params.id)
	try {
		const products: Product[] = await getProductsBySubcategory(subcategoryId)
		res.status(200).json(products)
	} catch (error) {
		res.status(500).json({ message: "The product information of the subcategory couldn't be displayed" })
	}

})
export default product