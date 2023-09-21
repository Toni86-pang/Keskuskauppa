import { useState } from "react"
import Dialog from "@mui/material/Dialog"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import axios from "axios"
import Notification from "./Notification"



interface User {
	userId: number
	username: string
	name: string
	email: string
	phone: string
	address: string
	city: string
	postal_code: string
}


interface Props {
	isOpen: boolean
	close: (updatedUser: User) => void
	user: User
	token: string
}

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


function UpdateProfile({ isOpen, close, user, token }: Props) {

	const [newAddress, setNewAddress] = useState(user.address)
	// const [token, setToken] = useState(DEBUGTOKEN2)
	const [newPhone, setNewPhone] = useState(user.phone)
	const [newCity, setNewCity] = useState(user.city)
	const [newPostalCode, setNewPostalCode] = useState(user.postal_code)

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

	const resetForm = () => {
		setNewAddress(user.address)
		setNewPhone(user.phone)
		setNewCity(user.city)
		setNewPostalCode(user.postal_code)
		// calls profile page's close function when closing the modal. 
		close(user)
	}


	const handleUpdateSubmit = async () => {
		try {
			const updatedData = {
				address: newAddress,
				city: newCity,
				postal_code: newPostalCode,
				phone: newPhone
			}
			await axios.put("/api/users/update", updatedData, {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			})
			setShowSuccessNotification(true)
			close({ ...user, address: newAddress, phone: newPhone, city: newCity, postal_code: newPostalCode })
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
						<TextField
							label="Puhelinnumero"
							value={newPhone}
							onChange={handlePhoneChange}
							fullWidth
						/>
					</div>				

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
					message="Product updated successfully!"
					type="success"
					onClose={() => setShowSuccessNotification(false)}
					duration={5000}
				/>
			)}
			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Error updating product."
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={5000}
				/> 
			)}
		</>
	)
}

export default UpdateProfile
