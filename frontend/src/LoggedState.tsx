// Whenever you want to use the logged in user, put these in your code:

import { UserTokenContext } from "./App"
import { useState, useEffect, useContext } from "react"
import { User, initialState } from "./types"
import { fetchUser } from "./services"

// Inside your main component function, for example:
//function Profile() {

const [token] = useContext(UserTokenContext)
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
