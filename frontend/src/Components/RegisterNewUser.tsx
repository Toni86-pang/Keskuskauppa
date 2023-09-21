import { ChangeEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button, Container, TextField } from "@mui/material"
import VerifyDialog from "./VerifyDialog"
import Notification from "./Notification"


export interface User {
	user_id?: number
	name?: string
	username?: string
	password?: string
	email?: string
	phone?: string
	address?: string
	city?: string
	postal_code?: string
}

const initialState: User = {
	name: "",
	username: "",
	password: "",
	email: "",
	phone: "",
	address: "",
	city: "",
	postal_code: ""
}

function RegisterNewUser() {

	const [newUser, setNewUser] = useState<User>(initialState)
	const [confirmPassword, setConfirmPassword] = useState<string>("")
	const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true)
	const [verifyOpen, setVerifyOpen] = useState(false)

	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)

	const { name, email, username, phone, address, city, postal_code } = newUser

	const navigate = useNavigate()

	const registerUser = async () => {

		try {
			const response = await axios.post("/api/users/register", newUser, {
				headers: {
					"Content-Type": "application/json",
				},
			})
			if (response.status === 200) {
				navigate("/")
				setShowSuccessNotification(true)
			} else if (response.status === 401) {
				setNewUser(initialState)
				setShowErrorNotification(true)
			} else {
				setNewUser(initialState)
				throw new Error("Something went wrong!")
			}
		} catch (error) {
			console.error(error)
			setShowErrorNotification(true) 
		}
	}
	
	const verifyDialogProps = {
		messageText: "Rekisteröidäänkö näillä tiedoilla?",
		isOpen: verifyOpen,
		setOpen: setVerifyOpen,
		onAccept: registerUser
	}

	const handleVerification = () => {
		setVerifyOpen(true)
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		setNewUser(() => ({
			...newUser, [name]: value
		}))
	}
	const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
		const newConfirmPassword = event.target.value
		setConfirmPassword(newConfirmPassword)
		setPasswordsMatch(newUser.password === newConfirmPassword)
	}
	const handleCancel = () => {
		setNewUser(initialState)
		setConfirmPassword("")
		setPasswordsMatch(true)
	}
	return (
		<Container sx={{ m: 1 }}>
			<Container>
				<TextField
					type="text"
					placeholder="your name"
					name="name"
					value={name}
					onChange={handleInputChange}
				/>

				<TextField
					type="email"
					placeholder="your email"
					name="email"
					value={email}
					onChange={handleInputChange}
				/>

				<TextField
					type="text"
					placeholder="enter a username"
					name="username"
					value={username}
					onChange={handleInputChange}
				/>

				<TextField
					type="text"
					placeholder="enter a phone number"
					name="phone"
					value={phone}
					onChange={handleInputChange}
				/>

				<TextField
					type="text"
					placeholder="enter a address"
					name="address"
					value={address}
					onChange={handleInputChange}
				/>

				<TextField
					type="text"
					placeholder="enter a city"
					name="city"
					value={city}
					onChange={handleInputChange}
				/>

				<TextField
					type="text"
					placeholder="Postinumero"
					name="postal_code"
					value={postal_code}
					onChange={handleInputChange}
				/>

				<TextField
					type="password"
					placeholder="Enter a password"
					name="password"
					value={newUser.password}
					onChange={handleInputChange}
				/>
				<TextField
					type="password"
					placeholder="Enter the password again"
					name="confirmPassword"
					value={confirmPassword}
					onChange={handleConfirmPasswordChange}
					error={!passwordsMatch}
					helperText={!passwordsMatch ? "Passwords do not match" : ""}
				/>
			</Container>
			<Container>
				<Button
					sx={{
						m: 1,
						bgcolor: "#6096ba",
						":hover": { bgcolor: "darkblue" }
					}}
					variant="contained"
					onClick={handleVerification}>Register</Button>
				<Button sx={{
					m: 1,
					bgcolor: "#6096ba",
					":hover": { bgcolor: "#d32f2f" },
				}}
				variant="contained"
				onClick={handleCancel}>
					Cancel
				</Button>
				<VerifyDialog {...verifyDialogProps} />

				{showSuccessNotification && (
					<Notification
						open={showErrorNotification}	
						message="Registration successful!"
						type="success"
						onClose={() => setShowSuccessNotification(false)}
						duration={5000} // Set the duration for the success notification
					/>
				)}

				{showErrorNotification && (
					<Notification
						open={showErrorNotification}
						message="Something went wrong or username already exists."
						type="error"
						onClose={() => setShowErrorNotification(false)}
						duration={5000} // Set the duration for the error notification
					/>
				)}

			</Container>

		</Container >
	)
}

export default RegisterNewUser
