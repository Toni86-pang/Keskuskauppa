import { Outlet } from "react-router"
import Navbar from "./Components/Navbar"
import { Container } from "@mui/material"
import { Dispatch, createContext, useEffect, useState } from "react"
import { ProductType } from "./types"

export type CartContextType = [ Dispatch<React.SetStateAction<ProductType[] | null>> ]

function App() {
	const [token, setToken] = useState("")
	const [cart, setCart] = useState<Array<ProductType> | null>(null)
	
	useEffect(() => {
		const tokenFromStorage = localStorage.getItem("token")
		if(tokenFromStorage){
			setToken(tokenFromStorage)
		}
	},[])

	return (
		<UserTokenContext.Provider value={[ token, setToken ]}>
			<Container sx={{ bgcolor: "#e7ecef", minHeight: "100%" }}>
				<Navbar cart={cart} setCart={setCart}/>
				<Outlet context={[ setCart ] satisfies CartContextType} />
			</Container>
		</UserTokenContext.Provider>
	)
}

export const UserTokenContext = createContext<[string, Dispatch<string>]>([
	"",
	() => {}
])

export default App
