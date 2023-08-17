import { executeQuery } from "../database"

export const addUser = async (username: string, name: string, email: string, phone: string, address: string, city: string, password: string) => {
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

export const getUserByUsername = async (username: string) => {
    const query = "SELECT * FROM users WHERE username = $1"
    const params = [username]
    const result = await executeQuery(query, params)
    return result.rows[0]
}

export const deleteUser = async (user_id: number) => {
    const query = 'DELETE FROM users WHERE user_id = $1'
    const params = [user_id]
    const result = await executeQuery(query, params)
    return result
}