import { ChangeEvent, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { UserTokenContext } from "../App"
import { UserValues } from "../types"
// import { loginUser } from "../services"
import Notification from "./Notification"
import axios from "axios"

const initialState: UserValues = {
	username: "",
	password: ""
}


function Login() {
	const [userValues, setUserValues] = useState<UserValues>(initialState)
	const [open, setOpen] = useState<boolean>(false)
	const [token, setToken] = useContext(UserTokenContext)
	const { username, password } = userValues
	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)
	
	const navigate = useNavigate()

	const loginUser = async (username: string, password: string) => {
		try {
			const response = await axios.post("/api/users/login", {
				username,
				password
			})
			if (response.status === 200) {
				const token = response.data.token
				setShowSuccessNotification(true)
				navigate("/")
				return token
			}
		}	catch (error) {
			console.error(error)
			setShowErrorNotification(true) 
		}
		handleClose()
	}

	const handleLogin = async () => {

		const token = await loginUser(username, password)

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
		<>
			<Container sx={{ m: 1 }}>
				{token ? (
					<Button sx={{ color: "white" }} onClick={handleLogout}>
						Kirjaudu ulos
					</Button>
				) : (
					<Button sx={{ color: "white" }} onClick={handleOpen}>
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

			{/* Success and error notifications */}
			{showSuccessNotification && (
				<Notification
					open={showSuccessNotification}
					message="Kirjautuminen onnistui!"
					type="success"
					onClose={() => setShowSuccessNotification(false)}
					duration={1500}
				/>
			)}
			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Käyttäjänimi tai salasana on virheellinen"
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={1500}
				/>
			)}

		</>
	)
}

export default Login
