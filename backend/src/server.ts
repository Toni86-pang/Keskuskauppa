import express, { Request, Response } from "express"
import users from "./routers/usersRouters"
import product from "./routers/productRouters"
import {
	createUsersTable,
	createGategoryTable,
	createSubcategoryTable,
	createProductsTable,
	createSalesTable,
	createReviewsTable,
	createMessageLogTable
}
	from "./routers/database"

const server = express()
server.use(express.json())
server.use("/api/users", users)
server.use("/api/product", product)

server.use("/", express.static("./dist/frontend"))
server.use("/version", (req: Request, res: Response) => {
	res.send("1.24")
})


// createUsersTable()
// createGategoryTable()
// createSubcategoryTable()
// createProductsTable()
// createSalesTable()
// createReviewsTable()
// createMessageLogTable()

export default server