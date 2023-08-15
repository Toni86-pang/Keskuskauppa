import server from "./server"
import express, { Request, Response } from "express"
import productRoutes from "./Routes/Routes"


const { PORT } = process.env
server.use("/", express.static("./dist/frontend"))
server.use(produ)


server.listen(PORT, () => {
	console.log("Listening to port", PORT)
})