import express, { Request, Response } from "express"
<<<<<<< 8ee675cb4c0edef5770e3d1cac2a670624f838a8
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
=======
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

>>>>>>> 38008fc201f4245da010528ea6a4a0d1f0f231e9

const server = express()
server.use(express.json())
server.use("/api/users", users)
<<<<<<< 8ee675cb4c0edef5770e3d1cac2a670624f838a8
=======
server.use("/api/product", product)

>>>>>>> 38008fc201f4245da010528ea6a4a0d1f0f231e9
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