import { Outlet } from "react-router"
import Navbar from "./Components/Navbar"
import { Container } from "@mui/material"
import { createContext, useState } from "react"

function App() {
	const [token, setToken] = useState("")

	return (
		<UserIDContext.Provider value={{ token, setToken }}>
			<Container sx={{ bgcolor: "#e7ecef", minHeight: "100%" }}>
				<Navbar />
				<Outlet />
			</Container>
		</UserIDContext.Provider>
	)
}

export interface UserTokenContext {
	token: string
	setToken: (token: string) => void
}

export const UserIDContext = createContext<UserTokenContext>({
	token: "",
	setToken: () => {}
})
export default App
