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

const server = express()
server.use(express.json())
server.use("/api/users", users)
server.use("/api/product", product)
server.use("/", express.static("./dist/frontend"))
server.use("/version", (req: Request, res: Response) => {
	res.send("1.26344")
})

server.get("/", (_req: Request, res: Response) => {
	res.send("Hello keskuskauppa!")
})

// createUsersTable()
// createGategoryTable()
// createSubcategoryTable()
// createProductsTable()
// createSalesTable()
// createReviewsTable()
// createMessageLogTable()

export default server