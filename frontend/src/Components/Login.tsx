/* eslint-disable no-mixed-spaces-and-tabs */
import { ChangeEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import NotificationComponent, {addNotification} from "./Notification"
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

	const showSuccessNotification = () => {
		NotificationComponent.addNotification({
		  message: "Login successful",
		  type: "success",
		})
	  }

	  const loginUser = async () => {
		try {
		  const response = await axios.post("/api/users/login", userValues, {
				headers: {
			  "Content-Type": "application/json",
				},
		  })
	
		  if (response.status === 200) {
				navigate("/")
				showSuccessNotification() // Show the success notification
		  } else if (response.status === 400 || response.status === 401) {
				alert("Username or password is incorrect")
		  } else {
				throw new Error("Something went wrong!")
		  }
		} catch (error) {
		  console.error(error)
		  alert("Something went wrong!")
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
		<Container sx={{ m: 1 }}>
			 <Button sx={{color: "white"}}onClick={handleClickOpen}>
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
			<NotificationComponent  />
		</Container >
	)
}

export default Login
