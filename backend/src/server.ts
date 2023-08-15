import express, { Request, Response } from "express"
import {
	createUsersTable,
	createGategoryTable,
	createSubcategoryTable,
	createProductsTable,
	createSalesTable,
	createReviewsTable,
	createMessageLogTable
}
	from "./database"
import users from "./routers/usersRouters"
const server = express()
server.use(express.json())
server.use("/api/users", users)

server.use("/", express.static("./dist/frontend"))

server.use("/version", (req: Request, res: Response) => {
	res.send("1.25")
})


server.get("/", (_req: Request, res: Response) => {
	res.send("Hello keskuskauppa!")
})

createUsersTable()
createGategoryTable()
createSubcategoryTable()
createProductsTable()
createSalesTable()
createReviewsTable()
createMessageLogTable()

export default server