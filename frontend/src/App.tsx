// import { useState } from 'react'
import { Outlet } from "react-router"
import Navbar from "./Components/Navbar"
import { Container } from "@mui/material"
import { createContext, useState } from "react"
import { User } from "./Components/Login"

function App() {
	// const [count, setCount] = useState(0)
	const [userData, setUserData] = useState<{ user: User }>({ user: 
		{ user_id: 0,
			username: "",
			password: "" } })

	const handleSetUserData = (user: User) => {
		setUserData({ user })
	}

	return (
		<UserIDContext.Provider value={{ ...userData, setUser: handleSetUserData }}>
			<Container sx={{ bgcolor: "#e7ecef", minHeight: "100%" }}>
				<Navbar />
				<Outlet />
			</Container>
		</UserIDContext.Provider>
	)
}

export interface UserDataContext {
	user: User
	setUser: (user: User) => void
}

export const UserIDContext = createContext<UserDataContext>({
	user: { user_id: 0,
		username: "",
		password: "",},
	setUser: () => {
		/*noop*/
	}
})
export default App
