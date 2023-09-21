/* eslint-disable no-mixed-spaces-and-tabs */
import { ChangeEvent, useContext, useState } from "react"
import axios from "axios"
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { UserDataContext, UserIDContext } from "../App"
import jwt_decode from "jwt-decode"

export interface User {
	id: number,
    username: string,
    password: string,
	name?: string,
	email?: string,
	phone?: string,
	address?: string,
	city?: string,
	postalCode?:string,
	is_Admin?: boolean,
	reviews?: number
}

const initialState: User = {
	id: 0,
	username: "",
	password: "",
	name: "",
	email: "",
	phone: "",
	address: "",
	city: "",
	postalCode: "",
	is_Admin: false,
	reviews: 0
}


interface UserToken {
    username: string,
    id: number,
    token: string
}

const useUserData = (): UserDataContext => useContext(UserIDContext)

function Login() {
	const userData = useUserData()

	const [userValues, setUserValues] = useState<User>(initialState)
	const [open, setOpen] = useState<boolean>(false)
	const [loggedInUser, setLoggedInUser] = useState<boolean>(false)

	const { username, password } = userValues

	// const navigate = useNavigate()

	const loginUser = async (username: string, password: string): Promise<UserToken | null> => {
		const response = await axios.post("/api/users/login", {
			username,
			password
		})
		const token = response.data.token
		console.log("this is token: ", token)

		if (token) {
			localStorage.setItem("token", JSON.stringify(token))
			const decodedToken = jwt_decode(token)
			console.log("this is decodedtoken: ", decodedToken)
		
			if (decodedToken) {
				const { username, id } = decodedToken as { username: string; id: number }
		
				const user: UserToken = { id, username, token }
		
				return user
			} else {
				throw new Error("Invalid JWT token")
			}
		} 
			
		// 	return response.data.token
		// } else if (response.status === 400) {
		// 	alert("Username or password is incorrect")
		// } else if (response.status === 401) {
		// 	alert("Username or password is incorrect")
		// } else {
		// 	throw new Error("Something went wrong!")
		// }
	
		return null
	}

	const handleLogin = async () => {

		const userToken = await loginUser(username, password)

		if (userToken) {
			// User logged in successfully
			console.log("Logged in:", userToken.username)
			userData.setUser({ id: userToken.id, password: "", username: userToken.username })
			console.log("this is userData: ", userData)
		} else {
			// Invalid login credentials
			console.log("Invalid login credentials")
			// Show an error message to the user
		}
		// if (response.status === 200) {
		// 	navigate("/")
		// 	alert("You are logged in")
		// } else if (response.status === 400) {
		// 	alert("Username or password is incorrect")
		// } else if (response.status === 401) {
		// 	alert("Username or password is incorrect")
		// } else {
		// 	throw new Error("Something went wrong!")
		// }
		setLoggedInUser(true)
		handleClose()
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		setUserValues(() => ({
			...userValues, [name]: value
		}))
	}

	const handleLogout = () => {
		setLoggedInUser(false)
		localStorage.removeItem("token")
		console.log("logged out")
	}

	const handleOpen = () => {
		setOpen(true)
	  }
	
	  const handleClose = () => {
		setOpen(false)
	  }

	return (
		<Container sx={{ m: 1 }}>
			{loggedInUser ? (
			 <Button sx={{color: "white"}}onClick={handleLogout}>
        		Kirjaudu ulos
				</Button>
			) : (
			 <Button sx={{color: "white"}}onClick={handleOpen}>
        		Kirjaudu sisään
				</Button>
			)
			}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Kirjaudu sisään</DialogTitle>
				<DialogContent>
					<TextField
						sx={{ m: 1 }}
						type="text"
						placeholder="Käyttäjänimi"
						name="username"
						value={username}
						onChange={handleInputChange}
					/>
					<TextField
						sx={{ m: 1 }}
						type="password"
						placeholder="Salasana"
						name="password"
						value={password}
						onChange={handleInputChange}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleLogin}>Kirjaudu</Button>
					<Button onClick={handleClose}>Peruuta</Button>
				</DialogActions>
			</Dialog>
		</Container >
	)
}

export default Login
