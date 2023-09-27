/* eslint-disable no-mixed-spaces-and-tabs */
import { ChangeEvent, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { UserTokenContext } from "../App"
import { UserValues } from "../types"
import { loginUser } from "../services"

const initialState: UserValues = {
	username: "",
	password: ""
}


function Login() {
	const [userValues, setUserValues] = useState<UserValues>(initialState)
	const [open, setOpen] = useState<boolean>(false)
	const [token, setToken] = useContext(UserTokenContext)
	const { username, password } = userValues

	const navigate = useNavigate()

	const handleLogin = async () => {

		const token = await loginUser(username, password)
		console.log(token)

		if (token) {
			localStorage.setItem("token", token)
			setToken(token)
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
		setToken("")
		console.log("logged out")
		navigate("/")
	}

	const handleOpen = () => {
		setOpen(true)
	  }
	
	  const handleClose = () => {
		setOpen(false)
	  }

	return (
		<Container sx={{ m: 1 }}>
			{token ? (
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
