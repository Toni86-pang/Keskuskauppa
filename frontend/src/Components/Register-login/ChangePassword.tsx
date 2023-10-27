import { ChangeEvent, useContext, useState } from "react"
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { UserTokenContext } from "../../App"
import Notification from "../Verify-notification/Notification"
import { changePassword } from "../../Services-types/services"
import { Form } from "react-router-dom"
import { ChangePasswordInputs, ChangePasswordProps } from "../../Services-types/types"

function ChangePassword({ username, open, onClose }: ChangePasswordProps) {
	const [changePasswordInputs, setChangePasswordInputs] = useState<ChangePasswordInputs>({currentPassword:"", newPassword:"", confirmPassword:""})
	const [token] = useContext(UserTokenContext)
	const { currentPassword, newPassword, confirmPassword } = changePasswordInputs
	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)


	const handleChangePassword = async () => {
		try {
			await changePassword(currentPassword, newPassword, token)
			setShowSuccessNotification(true)
			onClose()
		} catch (error) {
			console.error("Error changing password:", error)
			setShowErrorNotification(true)
		}
	}

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		setChangePasswordInputs(() => ({
			...changePasswordInputs, [name]: value
		}))

	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleChangePassword()
		}
	}

	return (
		<>
			<Container sx={{ m: 1 }}>
				<Dialog open={open} onClose={onClose}>
					<DialogTitle>Vaihda salasana</DialogTitle>
					<Form>
						<DialogContent>
							<input hidden readOnly name="username" value={username} />

							<TextField
								sx={{ m: 1 }}
								type="password"
								label="Nykyinen salasana"
								name="currentPassword"
								value={currentPassword}
								onChange={handleInputChange}
							/>
							<br />
							<TextField
								sx={{ m: 1 }}
								type="password"
								label="Uusi salasana"
								name="newPassword"
								value={newPassword}
								onChange={handleInputChange}
							/>
							<TextField
								sx={{ m: 1 }}
								type="password"
								label="Varmista salasana"
								name="confirmPassword"
								value={confirmPassword}
								onChange={handleInputChange}
								onKeyDown={handleKeyDown}
								error={newPassword !== confirmPassword}
								helperText={newPassword !== confirmPassword ? "Salasanat ovat erilaiset." : ""}
							/>
						</DialogContent>
						<DialogActions>
							<Button type="submit" disabled={newPassword !== confirmPassword} onClick={handleChangePassword}>Vaihda salasana</Button>
							<Button onClick={onClose}>Peruuta</Button>
						</DialogActions>
					</Form>
				</Dialog>
			</Container >

			{/* Success and error notifications */}
			{showSuccessNotification && (
				<Notification
					open={showSuccessNotification}
					message="Salasanan vaihto onnistui!"
					type="success"
					onClose={() => setShowSuccessNotification(false)}
					duration={1500}
				/>
			)}
			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Salasanan vaihto ei onnistunut."
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={1500}
				/>
			)}

		</>
	)
}

export default ChangePassword