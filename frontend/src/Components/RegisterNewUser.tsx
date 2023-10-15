import { ChangeEvent, useState, useContext } from "react"
import { UserTokenContext } from "../App"
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import VerifyDialog from "./VerifyDialog"
import { User, initialState } from "../types"
// import { registerUser } from "../services"
import Notification from "./Notification"
import axios, { AxiosError } from "axios"

function RegisterNewUser() {

	const [newUser, setNewUser] = useState<User>(initialState)
	const [, setToken] = useContext(UserTokenContext)
	const [confirmPassword, setConfirmPassword] = useState<string>("")
	const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true)
	const [verifyOpen, setVerifyOpen] = useState(false)
	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)
	const [showErrorNotificationTwo, setShowErrorNotificationTwo] = useState(false)
	const [showErrorNotificationThree, setShowErrorNotificationThree] = useState(false)

	const [dialogOpen, setDialogOpen] = useState(false)

	const { name, email, username, phone, address, city, postal_code } = newUser

	const register = async () => {
		try {
			const response = await axios.post("/api/users/register", newUser, {
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (response.status === 200) {
				setShowSuccessNotification(true)
				handleLogin(response.data)
			} else if (response.status === 401) {
				setShowErrorNotification(true)
			} else {
				setNewUser(initialState)
				setShowErrorNotificationTwo(true)
			}
		} catch (error) {
			if (error instanceof AxiosError && error.response) {
				console.error(error)
				if (error.response) {
					if (error.response.status === 401) {
						setShowErrorNotification(true)
					} else {
						setNewUser(initialState)
						setShowErrorNotificationTwo(true)
					}
				} else {
					setShowErrorNotificationThree(true)
				}
			}
		}
	}

	const handleLogin = (registerToken: string) => {
		if (registerToken) {
			localStorage.setItem("token", registerToken)
			setToken(registerToken)
			handleDialogClose()
		}
	}

	// preformattedText keeps linebreaks, tabs etc. It comes after messagetext.
	const verifyDialogProps = {
		messageText: "Rekisteröidäänkö näillä tiedoilla?",
		preformattedText: `Nimi: ${name}\nSähköposti: ${email}\nKäyttäjänimi: ${username}\nOsoite: ${address}\nKaupunki: ${city}\nPostinumero: ${postal_code}`,
		isOpen: verifyOpen,
		setOpen: setVerifyOpen,
		onAccept: register
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
		setDialogOpen(false)
	}

	const handleDialogOpen = () => {
		setDialogOpen(true)
	}

	const handleDialogClose = () => {
		setDialogOpen(false)
	}

	return (
		<>
			<Container sx={{ m: 1 }}>

				<Button sx={{ color: "white" }} onClick={handleDialogOpen}>
					Rekisteröidy
				</Button>

				<Dialog open={dialogOpen} onClose={handleDialogClose}>
					<DialogTitle>Rekisteröidy</DialogTitle>
					<DialogContent>

						<TextField
							type="text"
							placeholder="Nimi"
							name="name"
							value={name}
							onChange={handleInputChange}
						/>

						<TextField
							type="email"
							placeholder="Sähköpostiosoite"
							name="email"
							value={email}
							onChange={handleInputChange}
						/>

						<TextField
							type="text"
							placeholder="Käyttäjänimi"
							name="username"
							value={username}
							onChange={handleInputChange}
						/>

						<TextField
							type="text"
							placeholder="Puhelinnumero"
							name="phone"
							value={phone}
							onChange={handleInputChange}
						/>

						<TextField
							type="text"
							placeholder="Osoite"
							name="address"
							value={address}
							onChange={handleInputChange}
						/>

						<TextField
							type="text"
							placeholder="Kaupunki"
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
							placeholder="Salasana"
							name="password"
							value={newUser.password}
							onChange={handleInputChange}
						/>

						<TextField
							type="password"
							placeholder="Salasana uudelleen"
							name="confirmPassword"
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
							error={!passwordsMatch}
							helperText={!passwordsMatch ? "Salasanat ovat erilaiset." : ""}
						/>

					</DialogContent>
					<DialogActions>
						<Button onClick={handleVerification}>Rekisteröidy</Button>
						<Button onClick={handleCancel}>Peruuta</Button>
					</DialogActions>
				</Dialog>
				<VerifyDialog {...verifyDialogProps} />
			</Container >

			{/* Success and error notifications */}
			{showSuccessNotification && (
				<Notification
					open={showSuccessNotification}
					message="Rekisteröityminen onnistui!"
					type="success"
					onClose={() => setShowSuccessNotification(false)}
					duration={1500}
				/>
			)}
			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Käyttäjänimi on jo olemassa"
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={1500}

				/>
			)}
			{showErrorNotificationTwo && (
				<Notification
					open={showErrorNotificationTwo}
					message="Rekisteröitymisessä tapahtui virhe"
					type="error"
					onClose={() => setShowErrorNotificationTwo(false)}
					duration={1500}
				/>
			)}
			{showErrorNotificationThree && (
				<Notification
					open={showErrorNotificationThree}
					message="Server-virhe"
					type="error"
					onClose={() => setShowErrorNotificationThree(false)}
					duration={1500}
				/>
			)}
		</>
	)
}


export default RegisterNewUser
