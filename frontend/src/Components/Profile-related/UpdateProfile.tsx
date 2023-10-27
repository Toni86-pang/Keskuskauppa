import { ChangeEvent, useContext, useEffect, useState } from "react"
import Dialog from "@mui/material/Dialog"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { UpdateProfileProps } from "../../Services-types/types"
import { UserTokenContext } from "../../App"
import { updateUser } from "../../Services-types/services"
import Notification from "../Verify-notification/Notification"
import { FormControl, Input, InputLabel } from "@mui/material"


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

	const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0]
		if (file) {
			setNewUserImage(file)

		}
	}
	const resetForm = () => {
		setNewAddress(user.address)
		setNewPhone(user.phone)
		setNewCity(user.city)
		setNewPostalCode(user.postal_code)
		setNewUserImage(user.user_image)
		// calls profile page's close function when closing the modal. 
		close(user)
	}

	useEffect(() => {
		setNewAddress(user.address)
		setNewCity(user.city)
		setNewPostalCode(user.postal_code)
		setNewPhone(user.phone)
		setNewUserImage(user.user_image)
	}, [user])


	const handleUpdateSubmit = async () => {
		try {
			const formData = new FormData()
			formData.append("name", newAddress)
			formData.append("city", newCity)
			formData.append("postal_code", newPostalCode)
			formData.append("phone", newPhone)

			if (newUserImage) {
				formData.append("user_image", newUserImage)

			}
			
			await updateUser(formData, token)
			setShowSuccessNotification(true)
			close({ ...user, address: newAddress, phone: newPhone, city: newCity, postal_code: newPostalCode, user_image: newUserImage })
		} catch (error) {
			console.error("error updating profile", error)
			setShowErrorNotification(true)
		}
	}


	return (
		<>
			<Dialog open={isOpen} onClose={resetForm} >
				<DialogTitle>Muokkaa profiilia</DialogTitle>
				<DialogContent>
					<div>
						<div>Nimi: {user.name}</div>
						<div>Käyttäjänimi: {user.username}</div>
						<div>Sähköposti: {user.email}</div>
					</div>

					<div style={styles.section}>
						<div style={styles.label}>Osoite:</div>
						<div style={styles.section}>
							<TextField
								label="Katuosoite"
								value={newAddress}
								onChange={handleAddressChange}
								fullWidth
							/>
						</div>

						<div style={styles.section}>
							<TextField
								label="Kaupunki"
								value={newCity}
								onChange={handleCityChange}
								fullWidth
							/>
						</div>

						<div style={styles.section}>
							<TextField
								label="Postinumero"
								value={newPostalCode}
								onChange={handlePostalCodeChange}
								fullWidth
							/>
						</div>
					</div>
					<div style={styles.section}>
						<div style={styles.label}>Puhelinnumero:</div>
						<TextField
							label="Puhelinnumero"
							value={newPhone}
							onChange={handlePhoneChange}
							fullWidth
						/>
					</div>
					<FormControl>
						<InputLabel style={{ position: "relative" }} id="Kuvat">Muokkaa kuvaa:</InputLabel>
						<Input
							type="file"
							onChange={handleImageChange}
							inputProps={{ accept: "image/*" }}
						/>
					</FormControl>

					<div style={styles.buttonContainer}>
						<Button variant="outlined" onClick={handleUpdateSubmit}>
							Päivitä
						</Button>
						<Button variant="outlined" onClick={resetForm}>
							Peruuta
						</Button>
					</div>
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
		</>
	)
}

export default UpdateProfile