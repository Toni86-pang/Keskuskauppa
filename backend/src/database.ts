import pg from "pg"
import "dotenv/config"

const { PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DATABASE, PG_SSL } = process.env

export const pool = new pg.Pool({
	host: PG_HOST,
	port: Number(PG_PORT),
	user: PG_USERNAME,
	password: PG_PASSWORD,
	database: PG_DATABASE,
	ssl: PG_SSL === "enabled"
})


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const executeQuery = async (query: string, parameters?: Array<any>) => {
	const client = await pool.connect()
	try {
		const result = await client.query(query, parameters)
		return result
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		console.error(error.stack)
		error.name = "databaseError"
		throw error
	} finally { client.release() }
}

export const createUsersTable = async () => {
	const checkQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
	const checkResult = await executeQuery(checkQuery)
	if (checkResult?.rows[0]?.exists) {
		console.log("Users table already exists")
		return
	}

	const query = `
	CREATE TABLE IF NOT EXISTS Users (
		user_id serial PRIMARY KEY,
		username varchar(32),
		name varchar(200),
		email varchar(50),
		phone varchar(50),
		address varchar(50),
		city varchar(50),
		password varchar(200),
		user_image bytea,
		is_admin boolean,
		reviews integer
	  );`
	await executeQuery(query)
	console.log("Users table initialized")
}

export const createCategoryTable = async () => {
	const tableName = "Category" // Replace with the actual table name
	const checkQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)"
	const checkResult = await executeQuery(checkQuery, [tableName])
  
	if (checkResult?.rows[0]?.exists) {
		console.log(`${tableName} table already exists`)
		return
	}
  
	const query = `
	  CREATE TABLE IF NOT EXISTS ${tableName} (
		category_id serial PRIMARY KEY,
		category_name varchar(50)
	  );`
	
	await executeQuery(query)
	console.log(`${tableName} table initialized`)
}

export const createSubcategoryTable = async () => {
	const tableName = "Subcategory" // Replace with the actual table name
	const checkQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)"
	const checkResult = await executeQuery(checkQuery, [tableName])
  
	if (checkResult?.rows[0]?.exists) {
		console.log(`${tableName} table already exists`)
		return
	}

	const query = `CREATE TABLE IF NOT EXISTS Subcategory (
		subcategory_id serial PRIMARY KEY,
		subcategory_name varchar(50),
		category_id int REFERENCES Category(category_id)
	  );`

	await executeQuery(query)
	console.log(`${tableName} table initialized`)
}

export const createProductsTable = async () => {
	const tableName = "Products" // Replace with the actual table name
	const checkQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)"
	const checkResult = await executeQuery(checkQuery, [tableName])
  
	if (checkResult?.rows[0]?.exists) {
		console.log(`${tableName} table already exists`)
		return
	}
	const query = `CREATE TABLE IF NOT EXISTS Products (
		product_id serial PRIMARY KEY,
		user_id int REFERENCES Users(user_id),
		title varchar(50),
		category_id int REFERENCES Category(category_id),
		subcategory_id int REFERENCES Subcategory(subcategory_id),
		description varchar(200),
		price integer,
		product_image bytea
		postal_code integer,
		city varchar(60),
	  );`
	
	await executeQuery(query)
	console.log(`${tableName} table initialized`)
}

export const createSalesTable = async () => {
	const tableName = "Sales" // Replace with the actual table name
	const checkQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)"
	const checkResult = await executeQuery(checkQuery, [tableName])
  
	if (checkResult?.rows[0]?.exists) {
		console.log(`${tableName} table already exists`)
		return
	}
	const query = `CREATE TABLE IF NOT EXISTS Sales (
		sales_id serial PRIMARY KEY,
		product_id int REFERENCES Products(product_id),
		user_id int REFERENCES Users(user_id),
		status boolean
	  );`
	
	await executeQuery(query)
	console.log(`${tableName} table initialized`)
}

export const createReviewsTable = async () => {
	const tableName = "Reviews" // Replace with the actual table name
	const checkQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)"
	const checkResult = await executeQuery(checkQuery, [tableName])
  
	if (checkResult?.rows[0]?.exists) {
		console.log(`${tableName} table already exists`)
		return
	}
	const query = `CREATE TABLE IF NOT EXISTS Reviews (
		review_id serial PRIMARY KEY,
		product_id int REFERENCES Products(product_id),
		sales_id int REFERENCES Sales(sales_id),
		rating int,
		comment varchar(200)
	  );`
	
	await executeQuery(query)
	console.log(`${tableName} table initialized`)
}

export const createMessageLogTable = async () => {
	const tableName = "Message_log" // Replace with the actual table name
	const checkQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)"
	const checkResult = await executeQuery(checkQuery, [tableName])
  
	if (checkResult?.rows[0]?.exists) {
		console.log(`${tableName} table already exists`)
		return
	}
	const query = `CREATE TABLE IF NOT EXISTS Message_log (
		message_id serial PRIMARY KEY,
		sender_user_id int REFERENCES Users(user_id),
		receiver_user_id int REFERENCES Users(user_id),
		message text[],
		send_date timestamp
	  );`

	await executeQuery(query)
	console.log(`${tableName} table initialized`)
}