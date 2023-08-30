// import { useState } from 'react'
import { Outlet } from "react-router"
import Navbar from "./Components/Navbar"
import { Container } from "@mui/material"

function App() {
	// const [count, setCount] = useState(0)

	return (
		<Container sx={{ bgcolor: "#e7ecef", minHeight: "100%" }}>
			<Navbar />
			<Outlet />
		</Container>
	)
}

export default App
