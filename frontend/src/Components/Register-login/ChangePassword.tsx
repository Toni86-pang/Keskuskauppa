import { ChangeEvent, useContext, useState } from "react"
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, TextField } from "@mui/material"
import { UserTokenContext } from "../../App"
import Notification from "../Verify-notification/Notification"
import { changePassword } from "../../Services-types/services"
import { Form } from "react-router-dom"
import { ChangePasswordInputs, ChangePasswordProps } from "../../Services-types/types"
import { Visibility, VisibilityOff } from "@mui/icons-material"

function ChangePassword({ username, open, onClose }: ChangePasswordProps) {
	const [changePasswordInputs, setChangePasswordInputs] = useState<ChangePasswordInputs>({ currentPassword: "", newPassword: "", confirmPassword: "" })
	const [token] = useContext(UserTokenContext)
	const { currentPassword, newPassword, confirmPassword } = changePasswordInputs
	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)
	const [showPassword, setShowPassword] = useState(false)


	const handleChangePassword = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		try {
			await changePassword(currentPassword, newPassword, token)
			setShowSuccessNotification(true)	
			setChangePasswordInputs({ currentPassword: "", newPassword: "", confirmPassword: "" })
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

	return (
		<>
			<Container sx={{ m: 1 }}>
				<Dialog open={open} onClose={onClose}>
					<DialogTitle>Vaihda salasana</DialogTitle>
					<Form autoComplete="off" onSubmit={handleChangePassword}>
						<DialogContent>
							<input hidden readOnly autoComplete="username" name="username" value={username} />

							<TextField
								sx={{ m: 1 }}
								type={showPassword ? "text" : "password"}
								label="Nykyinen salasana"
								name="currentPassword"
								autoComplete="current-password"
								InputProps={{ // <-- This is where the toggle button is added.
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onMouseDown={() => setShowPassword(true)}
												onMouseUp={() => setShowPassword(false)}>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									)
								}}
								value={currentPassword}
								onChange={handleInputChange}
							/>
							<TextField
								sx={{ m: 1 }}
								type="password"
								label="Uusi salasana"
								name="newPassword"
								autoComplete="new-password"
								value={newPassword}
								onChange={handleInputChange}
							/>
							<TextField
								sx={{ m: 1 }}
								type="password"
								label="Varmista salasana"
								name="confirmPassword"
								autoComplete="new-password"
								value={confirmPassword}
								onChange={handleInputChange}
								error={newPassword !== confirmPassword}
								helperText={newPassword !== confirmPassword ? "Salasanat ovat erilaiset." : ""}
							/>
						</DialogContent>
						<DialogActions>
							<Button variant="contained" color="error" onClick={onClose}>Peruuta</Button>
							<Button variant="contained" color="success" type="submit" disabled={newPassword !== confirmPassword}>Vaihda salasana</Button>
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