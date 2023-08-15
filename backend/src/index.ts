import server from "./server"


const { PORT } = process.env


server.listen(PORT, () => {
	console.log("Listening to port", PORT)
})