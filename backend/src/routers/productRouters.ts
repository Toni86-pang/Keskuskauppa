import express, { Request, Response } from "express"
import { createProduct, getAllProducts, getProductById, getProductsByCategory, getProductsBySubcategory, updateProductData, deleteProduct, getProductsByUserId, Product, updateProductListed } from "../daos/productsDao"
import { authentication, validateCategoryId  } from "../middlewares"
import multer from "multer"

const product = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
interface CustomRequest extends Request {
	id?: number
}

/*  			 Products endpoints 				  */
product.post("/", authentication, upload.single("product_image"), async (req: CustomRequest, res: Response) => {
	const user_id = req.id
	try {
		const { title, category_id, subcategory_id, description, price, postal_code, city } = req.body
		let product_image: Buffer | undefined

		if (req.file) {
			product_image = req.file.buffer
		}

		if (!user_id || !title || !category_id || !subcategory_id || !price) {
			return res.status(400).send("Required information is missing.")
		}

		const newProduct = {
			user_id,
			title,
			category_id,
			subcategory_id,
			description,
			price,
			postal_code,
			city,
			product_image,
			listed: true
		}

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
})


product.get("/:id", async (req, res) => {
	try {
		const product_id: number = parseInt(req.params.id, 10)
		const productDetails: Product | null = await getProductById(product_id)
  
		if (productDetails === null) {
			res.status(404).json({ message: "Product not found" })
		} else {
		// Convert product_image to a Base64 encoded string
			if (productDetails.product_image instanceof Buffer) {
				productDetails.product_image = productDetails.product_image.toString("base64")
			}
  
			res.status(200).json(productDetails)
		}
	} catch (error) {
		res.status(500).json({ message: "Internal server error" })
	}
})

product.get("/user/:id", async (req, res) => {
	const userId = Number(req.params.id)
	try {
		const product: Product[] = await getProductsByUserId(userId)
		res.status(200).json(product)
	} catch (error) {
		res.status(500).json({ message: "So much fail" })
	}
})

product.delete("/:id", async (req: Request, res: Response) => {
	const product_id = Number(req.params.id)

	console.log("product_id", product_id)

	try {
		const result = await deleteProduct(product_id)
		console.log(result)
		if (result.rowCount > 0) {
			return res.status(200).send("Deleted")
		} else {
			return res.status(404).send("No products to delete")
		}
	} catch (error) {
		console.error(error)
		return res.status(500).send("Error")
	}
})

product.put("/update/:id", authentication, async (req: CustomRequest, res: Response) => {
	const product_Id = parseInt(req.params.id, 10)
	const userId = req.id
	const updatedProductData = req.body
	try {
		const product: Product | null = await getProductById(product_Id)
		if(!product) {
			return res.send(404).send()
		}
		// Can only update own products.
		if(product.user_id !== userId) {
			return res.send(403).send()
		}
		const updateProduct: Product | null = await updateProductData(
			product_Id,
			updatedProductData.title,
			updatedProductData.category_id,
			updatedProductData.subcategory_id,
			updatedProductData.city,
			updatedProductData.postal_code,
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

// update products 'listed' property
product.put("/listed/:id", authentication, async (req: CustomRequest, res: Response) => {
	const userId = req.id
	const productId = Number(req.params.id)
	const listed = req.body.listed
	try {
		const product: Product | null = await getProductById(productId)
		if(!product) {
			return res.send(404).send()
		}
		// Can only update own products.
		if(product.user_id !== userId) {
			return res.send(403).send()
		}
		const updatedProduct: Product | null = await updateProductListed(productId, listed)
		if (updatedProduct) {
			res.status(200).send(updatedProduct)
		} else {
			res.status(404).send()
		}
	} catch (error) {
		console.error("Error updating product:", error)
		res.status(500).send("Internal Server Error")
	}
})

//Serve products by category
product.get("/category/:id", validateCategoryId, async (req, res) => {
	const categoryId = parseInt(req.params.id)
	try {
		const products: Product[] = await getProductsByCategory(categoryId)
		res.status(200).json(products)
	} catch (error) {
		res.status(500).json({ message: "Product information couldn't be displayed" })
	}
})

// Serve products by subcategory
product.get("/subcategory/:id", validateCategoryId, async (req, res) => {
	const subcategoryId = parseInt(req.params.id)
	try {
		const products: Product[] = await getProductsBySubcategory(subcategoryId)
		res.status(200).json(products)
	} catch (error) {
		res.status(500).json({ message: "The product information of the subcategory couldn't be displayed" })
	}

})

export default product