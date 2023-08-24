import express, { Request, Response } from "express"
// import {
// 	createUsersTable,
// 	createGategoryTable,
// 	createSubcategoryTable,
// 	createProductsTable,
// 	createSalesTable,
// 	createReviewsTable, 
// 	createMessageLogTable
// }
// 	from "./database"
import users from "./routers/usersRouters"
import product from './routers/productRouters'
import category from "./routers/categoryRouters"
import { unknownEndpoint } from "./middlewares"

export const server = express()
server.use(express.json())

//Setup routers
server.use("/api/users", users)
server.use("/api/product", product)
server.use("/api/category", category)
server.use("/", express.static("./dist/frontend"))
server.use("/version", (req: Request, res: Response) => {
	res.send("1.4")
})

server.get('*', (_req, res) => {
	res.sendFile('index.html', { root: './dist/frontend' })
})

// Unknown endpoint handler
server.use(unknownEndpoint)

// createUsersTable()
// createGategoryTable()
// createSubcategoryTable()
// createProductsTable()
// createSalesTable()
// createReviewsTable()
// createMessageLogTable()

export default server