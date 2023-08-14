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
