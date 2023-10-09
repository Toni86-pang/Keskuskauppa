import express, { Request, Response } from "express"
import { updateSaleStatus } from "../daos/salesDao"

const sales = express.Router()

interface CustomRequest extends Request {
	user_id?: number
}

interface Sale {
	sales_id: number
	product_id?: number
	seller_id?: number
	buyer_id?: number	
	buyer_name?: string
	buyer_address?: string
	buyer_phone?: string
	buyer_email?: string
	sales_status?: number
}

sales.put("/update/:id", async (req: CustomRequest, res: Response) => {
	const salesId = Number(req.params.id)
	const newSaleStatus = req.body
	try {
		const updatedSale: Sale | null = await updateSaleStatus(salesId, newSaleStatus)
		if (updatedSale) {
			res.status(200).json({ message: "sales status updated", updatedSale })
		} else {
			res.status(404).json({ message: "sales not found" })
		}
	} catch (error) {
		console.error("Error updating sale status:", error)
		res.status(500).send("Internal Server Error")
	}
})



export default sales