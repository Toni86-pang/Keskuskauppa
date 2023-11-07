import { ChangeEvent, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Container, Dialog, DialogActions, DialogContent, Typography, TextField } from "@mui/material"
import { UserTokenContext } from "../../App"
import { UserValues } from "../../Services-types/types"
import Notification from "../Verify-notification/Notification"
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
		} catch (error) {
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

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleLogin()
		}
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
				)}
				<Dialog open={open} onClose={handleClose}>
					<Typography variant="h5" sx={{ textAlign: "center", mt: 2 }}>Kirjaudu sisään</Typography>
					<DialogContent sx={{ display: "flex", flexDirection: "column" }}>
						<TextField
							sx={{ m: 1 }}
							type="text"
							label="Käyttäjänimi"
							name="username"
							value={username}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
						/>
						<TextField
							sx={{ m: 1 }}
							type="password"
							label="Salasana"
							name="password"
							value={password}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
						/>
						<DialogActions sx={{ justifyContent: "space-between", marginTop: "10px" }}>
							<Button variant="contained" onClick={handleClose}>Peruuta</Button>
							<Button variant="contained" color={"success"} onClick={handleLogin}>Kirjaudu</Button>
						</DialogActions>
					</DialogContent>
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
