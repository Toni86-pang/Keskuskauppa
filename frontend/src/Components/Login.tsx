/* eslint-disable no-mixed-spaces-and-tabs */
import { useContext, useState } from "react"
import axios from "axios"
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { UserDataContext, UserIDContext } from "../App"
import jwt_decode from "jwt-decode"

export interface User {
	id: number,
    username: string,
    password: string
}

interface UserToken {
    username: string,
    id: number,
    token: string
}

const useUserData = (): UserDataContext => useContext(UserIDContext)

function Login() {
	const userData = useUserData()

	const [open, setOpen] = useState<boolean>(false)
	const [loggedInUser, setLoggedInUser] = useState<boolean>(false)

	// const navigate = useNavigate()

	const loginUser = async (username: string, password: string): Promise<UserToken | null> => {
		const token: string = await axios.post("/api/users/login", {
			username,
			password
		})

		if (token) {
			const decodedToken = jwt_decode(token)
			console.log(decodedToken)
		
			if (decodedToken) {
				const { username, id } = decodedToken as { username: string; id: number }
		
				const user: UserToken = { id, username, token }
				localStorage.setItem("user", JSON.stringify(user))
		
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

	// const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
	// 	const { name, value } = event.target
	// 	setUserValues(() => ({
	// 		...userValues, [name]: value
	// 	}))

	// }

	const handleLogin = async () => {
		const username = document.getElementById("username") as HTMLInputElement
		const password = document.getElementById("password") as HTMLInputElement

		console.log(username)
		console.log(password)

		const userToken = await loginUser(username.value, password.value)

		if (userToken) {
			// User logged in successfully
			console.log("Logged in:", userToken.username)
			userData.setUser({ id: userToken.id, password: "", username: userToken.username })
			handleClose()
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
						id="username"
						type="text"
						placeholder="Käyttäjänimi"
						name="username"
						value={username}
					/>
					<TextField
						sx={{ m: 1 }}
						id="password"
						type="password"
						placeholder="Salasana"
						name="password"
						value={password}
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
