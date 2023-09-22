/* eslint-disable no-mixed-spaces-and-tabs */
import { ChangeEvent, useContext, useState } from "react"
import axios from "axios"
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { UserTokenContext, UserIDContext } from "../App"
// import { useNavigate } from "react-router"
import { User } from "../types"
// import jwt_decode from "jwt-decode"

const initialState: User = {
	username: "",
	password: "",
}

const useUserToken = (): UserTokenContext => useContext(UserIDContext)

function Login() {
	const [userValues, setUserValues] = useState<User>(initialState)
	const [open, setOpen] = useState<boolean>(false)
	const { username, password } = userValues
	const userToken = useUserToken()

	// const navigate = useNavigate()

	const loginUser = async (username: string, password: string) => {
		const response = await axios.post("/api/users/login", {
			username,
			password
		})
		const token = response.data.token
		return token
	}

	const handleLogin = async () => {

		const token = await loginUser(username, password)
		console.log(token)

		if (token) {
			localStorage.setItem("token", JSON.stringify(token))
			userToken.setToken(token)
			handleClose()
		}
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		setUserValues(() => ({
			...userValues, [name]: value
		}))
	}

	const handleLogout = () => {
		localStorage.removeItem("token")
		userToken.setToken("")
		console.log("this is usertoken from logout: ", userToken.token)
		console.log("logged out")
		// navigate("/")
	}

	const handleOpen = () => {
		setOpen(true)
	  }
	
	  const handleClose = () => {
		setOpen(false)
	  }

	return (
		<Container sx={{ m: 1 }}>
			{userToken.token}
			<br/>
			{userToken.token ? (
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
