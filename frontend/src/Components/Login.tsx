import { ChangeEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import Notification from "./Notification"
export interface User {
	username: string,
	password: string
}

const initialState: User = {
	username: "",
	password: ""
}

function Login() {
	const [userValues, setUserValues] = useState<User>(initialState)
	const [open, setOpen] = useState<boolean>(false)
	const { username, password } = userValues
	const navigate = useNavigate()

	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)

	const loginUser = async () => {
		try {
			const response = await axios.post("/api/users/login", userValues, {
				headers: {
					"Content-Type": "application/json",
				},
			})
	
			if (response.status === 200) {
				navigate("/")
				setShowSuccessNotification(true) 
			} 
		} catch (error) {
			console.error(error)
			setShowErrorNotification(true) 
		}
		handleClose()
	}

	
	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		setUserValues(() => ({
			...userValues, [name]: value
		}))
	}

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<>
			<Container sx={{ m: 1 }}>
				<Button sx={{ color: "white" }} onClick={handleClickOpen}>
					Kirjaudu sisään
				</Button>
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
						<Button onClick={loginUser}>Kirjaudu</Button>
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
					duration={5000}
				/>
			)}
			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Käyttäjänimi tai salasana on virheellinen"
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={5000}
				/>
			)}
		
		</>
	)
}

export default Login
