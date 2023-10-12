import { Outlet } from "react-router"
import Navbar from "./Components/Navbar"
import { Container } from "@mui/material"
import { Dispatch, createContext, useEffect, useState } from "react"
import { ProductType } from "./types"

export type CartContextType = [ Dispatch<React.SetStateAction<ProductType[] | null>> ]
import { Footer } from "./Components/Footer"
import Box from "@mui/material/Box"

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
				sx={{
					bgcolor: "#e7ecef",
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
				}}>
				<Navbar cart={cart} setCart={setCart}/>
				<Box
					sx={{
						flex: 1,
						paddingTop: "20px",
					}}>
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
