import { executeQuery } from "./database"


export const getAllUsers = async () => {
	const query = "SELECT * FROM users"
	const result = await executeQuery(query)
	return result
}