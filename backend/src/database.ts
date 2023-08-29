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
	const query = `
	CREATE TABLE IF NOT EXISTS Users (
		user_ID serial PRIMARY KEY,
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

export const createGategoryTable = async () => {
	const query = `
	CREATE TABLE IF NOT EXISTS Category (
		category_ID serial PRIMARY KEY,
		category_name varchar(50)
	  );`
	await executeQuery(query)
	console.log("Category table initialized")
}

export const createSubcategoryTable = async () => {
	const query = `CREATE TABLE IF NOT EXISTS Subcategory (
		subcategory_ID serial PRIMARY KEY,
		subcategory_name varchar(50),
		category_ID int REFERENCES Category(category_ID)
	  );`
	await executeQuery(query)
	console.log("Subcategory table initialized")
}

export const createProductsTable = async () => {
	const query = `CREATE TABLE IF NOT EXISTS Products (
		product_ID serial PRIMARY KEY,
		user_ID int REFERENCES Users(user_ID),
		title varchar(50),
		category_ID int REFERENCES Category(category_ID),
		subcategory_ID int REFERENCES Subcategory(subcategory_ID),
		location varchar(60),
		description varchar(200),
		price integer,
		product_image bytea
	  );`
	await executeQuery(query)
	console.log("Products table initialized")
}

export const createSalesTable = async () => {
	const query = `CREATE TABLE IF NOT EXISTS Sales (
		sales_ID serial PRIMARY KEY,
		product_ID int REFERENCES Products(product_ID),
		user_ID int REFERENCES Users(user_ID),
		status boolean
	  );`
	await executeQuery(query)
	console.log("Sales table initialized")
}

export const createReviewsTable = async () => {
	const query = `CREATE TABLE IF NOT EXISTS Reviews (
		review_ID serial PRIMARY KEY,
		product_ID int REFERENCES Products(product_ID),
		sales_ID int REFERENCES Sales(sales_ID),
		rating int,
		comment varchar(200)
	  );`
	await executeQuery(query)
	console.log("Reviews table initialized")
}

export const createMessageLogTable = async () => {
	const query = `CREATE TABLE IF NOT EXISTS Message_log (
		message_ID serial PRIMARY KEY,
		sender_user_ID int REFERENCES Users(user_ID),
		receiver_user_ID int REFERENCES Users(user_ID),
		message text[],
		send_date timestamp
	  );`
	await executeQuery(query)
	console.log("Message log table initialized")
}