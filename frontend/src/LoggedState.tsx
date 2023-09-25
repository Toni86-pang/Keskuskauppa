// Whenever you want to use the logged in user, put these in your code:

import { UserTokenContext } from "./App"
import { useState, useEffect, useContext } from "react"
import { User, initialState } from "./types"
import { fetchUser } from "./services"

export function LoggedState() {

	const [token] = useContext(UserTokenContext)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [user, setUser] = useState<User>(initialState)

	const fetchUserDetails = async () => {
		if(!token){
			setUser(initialState)
			return
		}

		const user = await fetchUser(token)

		if (user === undefined) {
			console.error("error fetching user")
			return
		}
        
		setUser(user)
	}

	useEffect(() => {
		fetchUserDetails()
	}, [token])
}