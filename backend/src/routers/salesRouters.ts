import express, { Request, Response } from "express"
import { updateSaleStatus, createSale, getSaleById, fetchOwnSold, fetchOwnBought } from "../daos/salesDao"
import { authentication } from "../middlewares"
import { relistProductsAfterCancellation } from "../daos/productsDao"

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
		const productIds = [product_id]
		console.log(product_id, seller_id, buyer_id, buyer_name, buyer_address, buyer_city, buyer_postcode, buyer_phone, buyer_email)
		if (!product_id || !seller_id || !buyer_id || !buyer_name || !buyer_address || !buyer_city || !buyer_postcode || !buyer_phone || !buyer_email) {
			return res.status(400).send("Required information is missing.")
		}
		await createSale({ product_id, seller_id, buyer_id, buyer_name, buyer_address, buyer_city, buyer_postcode, buyer_phone, buyer_email }, productIds)
		res.status(201).json({ message: "Sale created successfully" })
	} catch (error) {
		res.status(500).json({ message: "Error creating product" })
	}
})

sales.get("/sold", authentication, async (req: CustomRequest, res: Response) => {
	const userId = req.id

	try {
		if (userId) {
			const sales: ProductSale[] = await fetchOwnSold(userId)
			return res.status(200).send(sales)
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
			const sales: ProductSale[] = await fetchOwnBought(userId)
			return res.status(200).send(sales)
		}
		
		return res.status(401).send()

	} catch (error) {
		console.error("Error fetching user's sales: ", error)
		res.status(500).send("Internal Server Error")
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
	const newSaleStatus = req.body.sale_status
	try {
		const sale: Sale = await getSaleById(salesId)
		const productIds: number[] = []
		if (sale.product_id !== undefined) {
			productIds.push(sale.product_id)
		}
		switch (newSaleStatus) {
			case 3:
				if (userId === sale.seller_id && sale.sales_status === 2) {
					await updateSaleStatus(salesId, newSaleStatus, productIds)
					return res.status(200).send({ message: "Sale status set to: sent" })
				}
				break
			case 4:
				if (userId === sale.buyer_id && sale.sales_status === 3) {
					await updateSaleStatus(salesId, newSaleStatus, productIds)
					return res.status(200).send({ message: "Sale statut set to: received" })
				}
				break
			case 5:
				if (userId === sale.buyer_id && sale.sales_status === 2) {
					await updateSaleStatus(salesId, newSaleStatus, productIds)
					await relistProductsAfterCancellation(productIds)
					return res.status(200).send({ message: "Sale status set to: cancelled" })
				}
				break
			case 6:
				if (sale.sales_status === 3) {
					await updateSaleStatus(salesId, newSaleStatus, productIds)
					await relistProductsAfterCancellation(productIds)
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

interface ProductSale {
	sales_id: number
	sales_status: string
	title: string
	price: number
	buyer: string
}



export default sales