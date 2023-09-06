import { executeQuery } from "../database"

export const addUser = async (username: string, name: string, email: string, phone: string, address: string, city: string, password: string) => {
	const query = "INSERT INTO \"users\" (username, name, email, phone, address, city, password) VALUES ($1, $2, $3, $4, $5, $6, $7);"
	const params = [username, name, email, phone, address, city, password]
	const result = await executeQuery(query, params)
	return result.rows[0]
}

export const getAllUsers = async () => {
	const query = "SELECT * FROM users"
	const result = await executeQuery(query)
	return result
}

export const getUserByUsername = async (username: string) => {
	const query = "SELECT * FROM users WHERE username = $1"
	const params = [username]
	const result = await executeQuery(query, params)
	return result.rows[0]
}

export const getUserByUserId = async (user_id: number) => {
	const query = "SELECT * FROM users WHERE user_id = $1"
	const params = [user_id]
	const result = await executeQuery(query, params)
	return result.rows[0]
}

export const deleteUser = async (user_id: number) => {
	const query = "DELETE FROM users WHERE user_id = $1"
	const params = [user_id]
	const result = await executeQuery(query, params)
	return result
}
export const findUserByUSername = async (username: string) => {
	const query = "SELECT * FROM users WHERE username = $1"
	const params = [username]
	return executeQuery(query, params)
}

export const findUserByEmail = async (email: string) => {
	const query = "SELECT * FROM users WHERE email = $1"
	const params = [email]
	return executeQuery(query, params)
}

export const updateProfile = async (
	user_id: number,
	email: string,
	phone: string,
	address: string,
	city: string,
	postal_code: string
) => {
	const params = [email, phone, address, city, postal_code, user_id]
	const query =
	"UPDATE users SET email = $1, phone = $2, address = $3, city = $4, postal_code = $5 WHERE user_id = $6 RETURNING user_id, username, name, email, phone, address, city, postal_code"
	const result = await executeQuery(query, params)
	if (result.rows.length === 0) {
		return null
	}
	console.log(result.rows[0])
	return result.rows[0]
}