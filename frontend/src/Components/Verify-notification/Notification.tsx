import { useEffect } from "react"
import Modal from "@mui/material/Modal"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

interface NotificationProps {
	open: boolean // Define the open prop to control modal visibility
	message: string
	type: "success" | "error"
	onClose: () => void
	actionText?: string
	onActionClick?: () => void
	duration?: number
}

function Notification({
	open, // Use the open prop to control modal visibility
	message,
	type,
	onClose,
	duration = 1000,
	actionText,
	onActionClick,
}: NotificationProps) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose() // Close the notification after the specified duration
		}, duration)

		return () => {
			clearTimeout(timer) // Clear the timer if the component unmounts early
		}
	}, [onClose, duration])

	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					backgroundColor: type === "success" ? "#4caf50" : "#f44336",
					color: "white",
					padding: "16px",
					borderRadius: "4px",
					textAlign: "center",
					boxShadow: 24,
					maxWidth: "80vw",
				}}
			>
				<p>{message}</p>
				{actionText && onActionClick && (
					<Button variant="contained" onClick={onActionClick}>
						{actionText}
					</Button>
				)}
			</Box>
		</Modal>
	)
}

export default Notification
