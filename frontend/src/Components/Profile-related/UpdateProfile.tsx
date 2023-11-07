import { useContext, useEffect, useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import DialogContent from "@mui/material/DialogContent"
import Typography from "@mui/material/Typography"
import { UpdateProfileProps } from "../../Services-types/types"
import { UserTokenContext } from "../../App"
import { updateUser } from "../../Services-types/services"
import Notification from "../Verify-notification/Notification"
import { Box, Card, CardMedia, FormControl, Input } from "@mui/material"


const styles = {
	section: {
		marginTop: "16px",
	},
	label: {
		marginBottom: "8px",
	},
	buttonContainer: {
		marginTop: "16px",
		display: "flex",
		justifyContent: "space-between",
	},
}

function UpdateProfile({ isOpen, close, user }: UpdateProfileProps) {

	const [token] = useContext(UserTokenContext)
	const [newAddress, setNewAddress] = useState(user.address)
	const [newPhone, setNewPhone] = useState(user.phone)
	const [newCity, setNewCity] = useState(user.city)
	const [newPostalCode, setNewPostalCode] = useState(user.postal_code)
	const [newUserImage, setNewUserImage] = useState<File | null>(null)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [, setError] = useState<string>("")

	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)

	const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewAddress(event.target.value)
	}
	const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewPhone(event.target.value)
	}
	const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewCity(event.target.value)
	}
	const handlePostalCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNewPostalCode(event.target.value)
	}

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileInput = event.target
		if (fileInput && fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0]
			setNewUserImage(file)
		
			const reader = new FileReader()
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string)
			}
			reader.readAsDataURL(file)
		} else {
			setError("Invalid image file. Please select a valid image.")
			setNewUserImage(null)
			setImagePreview(null)
		}
	}
	const resetForm = () => {
		setNewAddress(user.address)
		setNewPhone(user.phone)
		setNewCity(user.city)
		setNewPostalCode(user.postal_code)
		// calls profile page's close function when closing the modal. 
		close(user)
	}

	useEffect(() => {
		setNewAddress(user.address)
		setNewCity(user.city)
		setNewPostalCode(user.postal_code)
		setNewPhone(user.phone)
	}, [user])


	const handleUpdateSubmit = async () => {
		try {
			const formData = new FormData()
			formData.append("address", newAddress)
			formData.append("city", newCity)
			formData.append("postal_code", newPostalCode)
			formData.append("phone", newPhone)

			if (newUserImage) {
				formData.append("user_image", newUserImage)
			}

			await updateUser(formData, token)

			if (!newUserImage) {
				setShowSuccessNotification(true)
				close({ ...user, address: newAddress, phone: newPhone, city: newCity, postal_code: newPostalCode })
			} else {
				const reader = new FileReader()
				reader.onload = (event) => {
					const imageDataURL = event.target?.result as string
					setShowSuccessNotification(true)
					close({ ...user, address: newAddress, phone: newPhone, city: newCity, postal_code: newPostalCode, user_image: imageDataURL })
				}
				reader.readAsDataURL(newUserImage as File)
			}			

		} catch (error) {
			console.error("error updating profile", error)
			setShowErrorNotification(true)
		}
	}


	return (
		<Box>
			<Dialog open={isOpen} onClose={resetForm}>
				<Typography variant="h5" style={{textAlign: "center"}} mt={2}>Muokkaa profiilia</Typography>
				<DialogContent>
					<Box p={1}>
						<Typography>Nimi: {user.name}</Typography>
						<Typography>Käyttäjänimi: {user.username}</Typography>
						<Typography>Sähköposti: {user.email}</Typography>
					</Box>
					<Box style={styles.section}>
						<Typography style={styles.label}>Osoite:</Typography>
						<Typography style={styles.section}>
							<TextField
								label="Katuosoite"
								value={newAddress}
								onChange={handleAddressChange}
								fullWidth
							/>
						</Typography>

						<Box style={styles.section}>
							<TextField
								label="Kaupunki"
								value={newCity}
								onChange={handleCityChange}
								fullWidth
							/>
						</Box>

						<Box style={styles.section}>
							<TextField
								label="Postinumero"
								value={newPostalCode}
								onChange={handlePostalCodeChange}
								fullWidth
							/>
						</Box>
					</Box>

					<Box style={styles.section}>
						<Typography style={styles.label}>Puhelinnumero:</Typography>
						<Typography style={styles.section}>
							<TextField
								label="Puhelinnumero"
								value={newPhone}
								onChange={handlePhoneChange}
								fullWidth
							/>
						</Typography>
					</Box>

					<FormControl>
						<Typography style={{ position: "relative"}} pt={2} pb={1} id="Kuvat">
							Muokkaa kuvaa:
						</Typography>
						<Input type="file" onChange={handleImageChange} inputProps={{ accept: "image/*" }} />
						{newUserImage && (
							<Card sx={{ maxWidth: 300, p: 2 }}>
								<CardMedia
									component="img"
									height="300"
									src={imagePreview || ""}
									alt="Selected Image"
								/>
							</Card>
						)}
					</FormControl>

					<DialogActions style={styles.buttonContainer}>
						<Button variant="contained" onClick={resetForm}>
							Peruuta
						</Button>
						<Button variant="contained" color={"success"} onClick={handleUpdateSubmit}>
							Päivitä
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>


			{/* Success and error notifications */}
			{showSuccessNotification && (
				<Notification
					open={showSuccessNotification}
					message="Profiili päivitetty!"
					type="success"
					onClose={() => setShowSuccessNotification(false)}
					duration={1500}
				/>
			)}
			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Profiilin päivityksessä tapahtui virhe."
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={1500}
				/>
			)}
		</Box>
	)
}

export default UpdateProfile