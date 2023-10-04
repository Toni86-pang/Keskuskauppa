import { Outlet } from "react-router"
import Navbar from "./Components/Navbar"
import { Container } from "@mui/material"
import { Dispatch, createContext, useEffect, useState } from "react"
import { Footer } from "./Components/Footer"
import Box from "@mui/material/Box"

function App() {
	const [token, setToken] = useState("")

	useEffect(() => {
		const tokenFromStorage = localStorage.getItem("token")
		if (tokenFromStorage) {
			setToken(tokenFromStorage)
		}
	}, [])

	return (
		<UserTokenContext.Provider value={[token, setToken]}>
			<Container
				sx={{
					bgcolor: "#e7ecef",
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
				}}>
				<Navbar />
				<Box
					sx={{
						flex: 1,
						paddingTop: "20px",
					}}>
					<Outlet />
				</Box>
				<Footer />
			</Container>
		</UserTokenContext.Provider>
	)
}

export const UserTokenContext = createContext<[string, Dispatch<string>]>([
	"",
	() => { }
])
export default App
