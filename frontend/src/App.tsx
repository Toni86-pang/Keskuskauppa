import { Outlet } from "react-router"
import Navbar from "./Components/Navbar"
import { Container } from "@mui/material"
import { createContext, useState } from "react"

function App() {
	const [token, setToken] = useState<string>()

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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	token: any
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setToken: (token: any) => void
}

export const UserIDContext = createContext<UserTokenContext>({
	token: " ",
	setToken: () => {
		/*noop*/
	}
})
export default App
