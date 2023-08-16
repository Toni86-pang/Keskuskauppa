import { executeQuery } from "../routers/database"

export const addUser = async (username: string, name :string, email: string, phone: string, address: string, city: string, password: string)=> {
    const query = 'INSERT INTO "users" (username, name, email, phone, address, city, password) VALUES ($1, $2, $3, $4, $5, $6, $7);'
    const params = [username, name, email, phone, address, city, password]
    const result = await executeQuery(query, params)
    return result.rows[0]
}

export const getAllUsers = async () => {
	const query = "SELECT * FROM users"
	const result = await executeQuery(query)
	return result
}