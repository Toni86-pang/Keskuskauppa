import { ChangeEvent, useState, useContext } from "react"
import { UserTokenContext } from "../../App"
import { Button, Container, FormControl, Input, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Card, CardMedia } from "@mui/material"
import VerifyDialog from "../Verify-notification/VerifyDialog"
import { User, initialState } from "../../Services-types/types"
import Notification from "../Verify-notification/Notification"
import axios, { AxiosError } from "axios"

function RegisterNewUser() {

	const [newUser, setNewUser] = useState<User>(initialState)
	const [confirmPassword, setConfirmPassword] = useState<string>("")
	const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false)
	const [isTouched, setIsTouched] = useState(false)
	const [verifyOpen, setVerifyOpen] = useState(false)
	const [userImage, setUserImage] = useState<File | null>(null)	
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [, setError] = useState<string>("")

	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)
	const [showErrorNotificationTwo, setShowErrorNotificationTwo] = useState(false)
	const [showErrorNotificationThree, setShowErrorNotificationThree] = useState(false)
	const [, setToken] = useContext(UserTokenContext)
	const [dialogOpen, setDialogOpen] = useState(false)

	const { name, email, username, phone, address, city, postal_code, password } = newUser

	const register = async () => {
		try {
			const formData = new FormData()
			formData.append("name", name)
			formData.append("email", email)
			formData.append("username", username)
			formData.append("phone", phone)
			formData.append("address", address)
			formData.append("city", city)
			formData.append("postal_code", postal_code)
			formData.append("password", password)
			if (userImage) {
				formData.append("user_image", userImage)
			}

			console.log("FormData entries:", Object.fromEntries(formData.entries()))

			const config = {
				method: "POST",
				url: "/api/users/register",
				headers: {
					"Content-Type": "multipart/form-data",
				},
				data: formData,
			}
			
			console.log("Axios Request Configuration:", config)
			console.log("formData:", formData)
			const response = await axios.post("api/users/register", formData, config ) 
	
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
					if (error.response.status === 400) {
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

	const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newPassword = event.target.value
		const isMatch = newPassword === newUser.password
		setIsTouched(true)
		setConfirmPassword(newPassword)
		setPasswordsMatch(isMatch)
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

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileInput = event.target
		if (fileInput && fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0]
			setUserImage(file)
		
			const reader = new FileReader()
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string)
			}
			reader.readAsDataURL(file)
		} else {
			setError("Invalid image file. Please select a valid image.")
			setUserImage(null)
			setImagePreview(null)
		}
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
							error={!passwordsMatch && isTouched}
							helperText={!passwordsMatch && isTouched ? "Salasanat ovat erilaiset." : ""}
						/>
						<FormControl>
							<InputLabel style={{position: "relative"}} id="Kuvat">Lisää kuva:</InputLabel>
							<Input
								type="file"
								onChange={handleImageChange}
								inputProps={{ accept: "image/*" }}	
							/>
							{userImage && (
								<Card sx={{ maxWidth: 345 }}>
									<CardMedia
										component="img"
										height="140"
										src={imagePreview || ""}
										alt="Selected Image"
									/>
								</Card>
							)}
						</FormControl>

					</DialogContent>
					<DialogActions>
						<Button disabled={!passwordsMatch} onClick={handleVerification}>Rekisteröidy</Button>
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
