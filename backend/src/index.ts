import express, { Request, Response } from "express"

const server = express()

server.use("/", express.static("./dist/frontend"))

server.use("/version", (req: Request, res: Response) => {
	res.send("1.21")
})

server.get("/", (_req: Request, res: Response) => {
	res.send("Hello keskuskauppa!")
})

server.listen(3000, () => {
	console.log("Listening to port 3000")
})