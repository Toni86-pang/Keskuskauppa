import { executeQuery } from "../database"

export const updateSaleStatus = async (salesId: number, salesStatus: number) => {
	const params = [salesId, salesStatus]
	const query = "UPDATE sales SET sales_status = $2 WHERE sales_id = $1 RETURNING *"
	const result = executeQuery(query, params)
	return (await result).rows[0]
}