import express, { Request, Response } from "express"
import { updateSaleStatus, createSale, getSaleById, fetchOwnSold, fetchOwnBought, getStatusById, updateSaleReviewedStatus } from "../daos/salesDao"
import { authentication } from "../middlewares"

const sales = express.Router()

interface CustomRequest extends Request {
	id?: number
}

interface Sale {
	sales_id?: number
	product_id?: number
	seller_id?: number
	buyer_id?: number
	buyer_name?: string
	buyer_address?: string
	buyer_city?: string
	buyer_postcode?: string
	buyer_phone?: string
	buyer_email?: string
	sales_status?: number
}

sales.post("/", authentication, async (req: CustomRequest, res: Response) => {
	const buyer_id = req.id
	try {
		const { product_id, seller_id, buyer_name, buyer_address, buyer_city, buyer_postcode, buyer_phone, buyer_email } = req.body
		if (!product_id || !seller_id || !buyer_id || !buyer_name || !buyer_address || !buyer_city || !buyer_postcode || !buyer_phone || !buyer_email) {
			return res.status(400).send("Required information is missing.")
		}
		await createSale({ product_id, seller_id, buyer_id, buyer_name, buyer_address, buyer_city, buyer_postcode, buyer_phone, buyer_email })
		res.status(201).json({ message: "Sale created successfully" })
	} catch (error) {
		res.status(500).json({ message: "Error creating product" })
	}
})

sales.get("/sold", authentication, async (req: CustomRequest, res: Response) => {
	const userId = req.id

	try {
		if (userId) {
			const sales: ProductSaleBackend[] = await fetchOwnSold(userId)

			const updatedSales = sales.map((sale) => {
				if (sale.product_image instanceof Buffer) {
					const tempProductImage = "data:image/*;base64," + sale.product_image.toString("base64")
					return { ...sale, product_image: tempProductImage }
				} else {
					return { ...sale, product_image: "" }
				}
			})

			return res.status(200).send(updatedSales)
		}

		return res.status(401).send()

	} catch (error) {
		console.error("Error fetching user's sales: ", error)
		res.status(500).send("Internal Server Error")
	}
})

sales.get("/bought", authentication, async (req: CustomRequest, res: Response) => {
	const userId = req.id
	try {
		if (userId) {
			const sales: ProductSaleBackend[] = await fetchOwnBought(userId)

			const updatedSales = sales.map((sale) => {
				if (sale.product_image instanceof Buffer) {
					const tempProductImage = "data:image/*;base64," + sale.product_image.toString("base64")
					return { ...sale, product_image: tempProductImage }
				} else {
					return { ...sale, product_image: "" }
				}
			})

			return res.status(200).send(updatedSales)
		}

		return res.status(401).send()

	} catch (error) {
		console.error("Error fetching user's sales: ", error)
		res.status(500).send("Internal Server Error")
	}
})

sales.get("/status/:id", async (req: Request, res: Response) => {
	const statusId = Number(req.params.id)

	try {
		const sales_status = await getStatusById(statusId)
		res.status(200).send(sales_status)
	} catch (error) {
		res.status(500).send()
	}


})


sales.get("/:id", authentication, async (req: CustomRequest, res: Response) => {
	const userId = req.id
	const saleId = Number(req.params.id)

	try {
		const sale: Sale = await getSaleById(saleId)
		if (!sale) {
			return res.status(404).send()
		} else if (userId !== sale.seller_id && userId !== sale.buyer_id) {
			return res.status(403).send("Forbidden")
		} else {
			return res.status(200).send(sale)
		}
	} catch (error) {
		console.error("Error fetching sale")
		res.status(500).send("Internal Server Error")
	}
})

sales.put("/update/:id", authentication, async (req: CustomRequest, res: Response) => {
	const userId = req.id
	const salesId = Number(req.params.id)
	const newSaleStatus = req.body.sales_status
	try {
		const sale: Sale = await getSaleById(salesId)
		const productIds: number[] = []
		if (sale.product_id !== undefined) {
			productIds.push(sale.product_id)
		}
		switch (newSaleStatus) {
			case 3:
				if (userId === sale.seller_id && sale.sales_status === 2) {
					await updateSaleStatus(salesId, newSaleStatus)
					return res.status(200).send({ message: "Sale status set to: sent" })
				}
				break
			case 4:
				if (userId === sale.buyer_id && sale.sales_status === 3) {
					await updateSaleStatus(salesId, newSaleStatus)
					return res.status(200).send({ message: "Sale statut set to: received" })
				}
				break
			case 5:
				if ((userId === sale.seller_id || userId === sale.buyer_id) && sale.sales_status === 2) {
					await updateSaleStatus(salesId, newSaleStatus)
					return res.status(200).send({ message: "Sale status set to: cancelled" })
				}
				break
			case 6:
				if (sale.sales_status === 3) {
					await updateSaleStatus(salesId, newSaleStatus)
					return res.status(200).send({ message: "Sale status se to: received (not confirmed)" })
				}
				break
			default:
				return res.status(400).send({ error: "Invalid status update." })
		}
		return res.status(403).send({ error: "Unauthorized status update." })
	} catch (error) {
		console.error("Error updating sale status:", error)
		res.status(500).send("Internal Server Error")
	}

})

//update sale reviewed property
sales.put("/reviewupdate/:id", authentication, async (req: CustomRequest, res: Response) => {
	const userId = req.id
	const salesId = Number(req.params.id)
	const reviewed = req.body.reviewed
	try {
		const sale: Sale = await getSaleById(salesId)
		if (userId === sale.buyer_id) {
			await updateSaleReviewedStatus(salesId, reviewed)
			return res.status(200).send({ message: "Sale reviewed status set to true." })
		} else {
			return res.status(401).send({ message: "Not authorised to make a review on this sale." })
		}
	} catch (error) {
		console.error("Error updating review status on sale:", error)
		res.status(500).send("Internal Server Error")
	}

})

interface ProductSaleBackend {
	sales_id: number
	sales_status: string
	title: string
	price: number
	buyer: string
	product_image: Buffer | string
}

export default sales