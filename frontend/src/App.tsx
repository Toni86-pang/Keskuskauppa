import { Outlet } from "react-router"
import Navbar from "./Components/Footer-nav/Navbar"
import { Container } from "@mui/material"
import { Dispatch, createContext, useEffect, useState } from "react"
import { ProductType } from "./Services-types/types"
import { Footer } from "./Components/Footer-nav/Footer"
import Box from "@mui/material/Box"
import { BadgeProvider } from "./Components/BadgeContext"
import SalesNotification from "./Components/Footer-nav/SalesNotification"

export type CartContextType = [Dispatch<React.SetStateAction<ProductType[] | null>>]

function App() {
	const [token, setToken] = useState("")
	const [cart, setCart] = useState<Array<ProductType> | null>(null)

	useEffect(() => {
		const tokenFromStorage = localStorage.getItem("token")
		if (tokenFromStorage) {
			setToken(tokenFromStorage)
		}
	}, [])

	return (
		<UserTokenContext.Provider value={[token, setToken]}>
			<Container
				maxWidth="xl" // Adjust the maximum width if needed
				sx={{
					bgcolor: "#e7ecef",
					minHeight: "100vh", 
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Navbar cart={cart} setCart={setCart} />
				<Box
					sx={{
						flex: 1,
						paddingTop: "10px",
					}}
				>
					<Outlet context={[ setCart ] satisfies CartContextType} />
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
