import server from "./server"
import express from "express"


const { PORT } = process.env
server.use("/", express.static("./dist/frontend"))


server.listen(PORT, () => {
	console.log("Listening to port", PORT)
})