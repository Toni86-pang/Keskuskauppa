import { executeQuery } from "../database"
import { updateProductListed } from "./productsDao"

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
	reviewed?: boolean
}
interface ProductSale {
	sales_id: number
	sales_status: string
	title: string
	price: number
	buyer: string
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
	RETURNING *
  `
	try {
		const result = await executeQuery(query, params)
		if(sale.product_id) {
			await updateProductListed(sale.product_id, false)
		}		
		return result.rows[0]
	} catch (error) {
		console.error("Error creating sale:", error)
		throw error
	}

}

export const updateSaleStatus = async (salesId: number, salesStatus: number) => {
	const params = [salesId, salesStatus]
	const query = "UPDATE sales SET sales_status = $2 WHERE sales_id = $1 RETURNING *"
	try{
		const result = await executeQuery(query, params)
		return result.rows[0]
	}catch (error){
		console.error("Error updating sale status", error)
		throw error
	}
}

export const updateSaleReviewedStatus = async (salesId: number, newValue: boolean) => {
	const params = [salesId, newValue]
	const query = "UPDATE sales SET reviewed = $2 WHERE sales_id = $1 RETURNING *"
	try{
		const result = await executeQuery(query, params)
		return result.rows[0]
	}catch (error){
		console.error("Error updating sale status", error)
		throw error
	}
}

export const getStatusById = async (statusId: number) => {
	const params = [statusId]
	const query = "SELECT sales_status FROM sales_status WHERE status_id = $1"

	try {
		const result = await executeQuery(query, params)
		return result.rows[0].sales_status
	} catch (error) {
		console.error("Error fetching sales status: ", error)
	}
}


export const fetchOwnSold = async (userId: number): Promise<ProductSale[]>  => {
	const params = [userId]
	const query = `
	SELECT
		s.sales_id as sales_id,
		st.sales_status,
		p.title AS title,
		p.price AS price,
		p.listed AS listed,
		u.username AS buyer
	FROM 
		sales AS s
	JOIN 
		users AS u ON s.buyer_id = u.user_id
	JOIN
    	products AS p ON s.product_id = p.product_id
	JOIN
		sales_status AS st on s.sales_status = st.status_id
	WHERE
    	s.seller_id = $1`
	
	const result = await executeQuery(query, params)
	return result.rows
}

export const fetchOwnBought = async (userId: number): Promise<ProductSale[]>  => {
	const params = [userId]
	const query = `
	SELECT
		s.sales_id as sales_id,
		st.sales_status,
		p.title AS title,
		p.price AS price,
		u.username AS seller
	FROM 
		sales AS s
	JOIN 
		users AS u ON s.seller_id = u.user_id
	JOIN
    	products AS p ON s.product_id = p.product_id
	JOIN
		sales_status AS st on s.sales_status = st.status_id
	WHERE
    	s.buyer_id = $1`
	try{
		const result = await executeQuery(query, params)
		console.log(result.rows[0])
		return result.rows
	}catch (error){
		console.error("Error updating sale status", error)
		throw error
	}
}