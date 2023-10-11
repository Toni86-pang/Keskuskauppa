import { executeQuery } from "../database"

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

export const getSaleById = async (saleId: number): Promise<Sale> => {
	const params = [saleId]
	const query = "SELECT * FROM sales where sales_id = $1;"
	try {
		const result = await executeQuery(query, params)
		const sale: Sale = result.rows[0]
		return sale
	} catch (error) {
		console.error("Error fetching sale: ", error)
		throw(error)
	}
}

export const createSale = async (sale: Sale): Promise<Sale> => {
	const params = [
		sale.product_id,
		sale.seller_id,
		sale.buyer_id,
		sale.buyer_name,
		sale.buyer_address,
		sale.buyer_city,
		sale.buyer_postcode,
		sale.buyer_phone,
		sale.buyer_email,

	]
	const query = `
	INSERT INTO sales
	  ( product_id, seller_id, buyer_id, buyer_name, buyer_address, buyer_city, buyer_postcode, buyer_phone, buyer_email  )
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `
	try {
		const result = await executeQuery(query, params)
		return result.rows[0]
	} catch (error) {
		console.error("Error creating sale:", error)
		throw error
	}

}

export const updateSaleStatus = async (salesId: number, salesStatus: number) => {
	const params = [salesId, salesStatus]
	const query = "UPDATE sales SET sales_status = $2 WHERE sales_id = $1 RETURNING *"
	const result = executeQuery(query, params)
	return (await result).rows[0]
}