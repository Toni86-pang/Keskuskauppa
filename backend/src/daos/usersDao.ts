import { executeQuery } from "../database"
export interface UserBackend {
    user_id?: number
    username: string
    name: string
    email: string
    phone: string
    address: string
    city: string
    postal_code: string
    password: string
    user_image?: Buffer
 }

export async function addUser(user: UserBackend): Promise<void> {
	let query
	let values

	if (user.user_image) {
		query =
        `INSERT INTO users
              (username, name, email, phone, address, city, postal_code, password, user_image)
        VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            returning user_id;`

		values = [
			user.username,
			user.name,
			user.email,
			user.phone,
			user.address,
			user.city,
			user.postal_code,
			user.password,
			user.user_image
		]
	} else {
		query = 
        `INSERT INTO users
            (username, name, email, phone, address, city, postal_code, password)
          VALUES
              ($1, $2, $3, $4, $5, $6, $7, $8)
              returning user_id;`

		values = [
			user.username,
			user.name,
			user.email,
			user.phone,
			user.address,
			user.city,
			user.postal_code,
			user.password
		]
	}
	try {
		const result = await executeQuery(query, values)
		return result.rows[0].user_id
	} catch (error) {
		console.error("Error creating user:", error)
		throw error
	}
}

export const changePassword = async (
	user_id: number,
	hashedPassword: string
) => {
	const params = [user_id, hashedPassword]
	const query =
		"UPDATE users SET password = $2 WHERE user_id = $1 RETURNING user_id"
	const result = await executeQuery(query, params)

	if (result.rows.length === 0) {
		return null
	}
	return result.rows[0]
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
	// first delete all user's products before deleting user
	const delProductsQuery = "DELETE FROM products WHERE user_id = $1"
	const delProductsParams = [user_id]
	await executeQuery(delProductsQuery, delProductsParams)
	// then delete user
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

export async function updateProfile( user: UserBackend): Promise<UserBackend | null>{
	let query
	let values

	if(user.user_image){
		query =
		`UPDATE users 
		SET 
		phone = $1, address = $2, city = $3, postal_code = $4, user_image = $5
		WHERE user_id = $6
		RETURNING user_id, username, name, email, phone, address, city, postal_code, user_image`
	
		values = [
			user.phone, 
			user.address, 
			user.city,
			user.postal_code,
			user.user_image,
			user.user_id
		]
	} else{
		query =
		`UPDATE users 
		SET 
		phone = $1, address = $2, city = $3, postal_code = $4
		WHERE user_id = $5
		RETURNING user_id, username, name, email, phone, address, city, postal_code`

		values = [
			user.phone, 
			user.address, 
			user.city,
			user.postal_code,
			user.user_id
		]
	}
	try{
		const result = await executeQuery(query, values)
		if (result.rows.length === 0) {
			return null
		}
		return result.rows[0]
	} catch (error){
		console.error("Error updating user profile", error)
		throw error
	}
}


export const getUserDetailsByUserId = async(user_id: number): Promise<UserBackend[]> => {
	const query = `
	SELECT
		users.username,
		users.city,
		users.postal_code,
		users.reg_day,
		users.user_id,
		users.user_image
	FROM
		users
  	WHERE 
		user_id = $1;`

	const params = [user_id]
	const result = await executeQuery(query, params)

	return result.rows
}



