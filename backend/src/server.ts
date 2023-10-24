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
import product from "./routers/productRouters"
import category from "./routers/categoryRouters"
import sales from "./routers/salesRouters"
import review from "./routers/reviewRouters"
import { unknownEndpoint } from "./middlewares"
import search from "./routers/searchproductRouters"

export const server = express()
server.use(express.json())

//Setup routers
server.use("/api/users", users)
server.use("/api/product", product)
server.use("/api/category", category)
server.use("/api/sales", sales)
server.use("/api/search", search)
server.use("/api/review", review)
server.use("/", express.static("./dist/frontend"))
server.use("/version", (req: Request, res: Response) => {
	res.send("1.81")
})

server.get("*", (_req, res) => {
	res.sendFile("index.html", { root: "./dist/frontend" })
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