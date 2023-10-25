import { useContext, useState } from "react"
import Dialog from "@mui/material/Dialog"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import { UserTokenContext } from "../App"
import Notification from "./Notification"
import { ReviewComment } from "../types"
import { leaveComment } from "../services"

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

const MAXCOMMENTLENGTH = 500

interface LeaveCommentProps {
	reviewId: number
	isOpen: boolean
	close: () => void
}

function LeaveComment({ isOpen, close, reviewId }: LeaveCommentProps) {

	const [token] = useContext(UserTokenContext)
	const [comment, setComment] = useState("")
	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)

	const resetForm = () => {		
		close()
	}

	const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newComment = event.target.value
		if (newComment.length < MAXCOMMENTLENGTH) {
			setComment(event.target.value)
		} 		
	}

	const handleLeaveComment = async () => {
		try {
			const commentData: ReviewComment = {
				comment: comment,
				review_id: reviewId				
			}
			await leaveComment(commentData, token)
			setShowSuccessNotification(true)
			close()
		} catch (error) {
			console.error("Error leaving comment", error)
			setShowErrorNotification(true)
		}
	}

	return (
		<>
			<Dialog open={isOpen} onClose={resetForm} >
				<DialogTitle>Jätä kommentti</DialogTitle>
				<DialogContent>
					<div style={styles.section}>
						<div style={styles.label}>Kommentti:</div>
						<TextField
							label="Kommentti"
							value={comment}
							onChange={handleCommentChange}
							fullWidth
						/>
					</div>				

					<div style={styles.buttonContainer}>
						<Button variant="outlined" onClick={handleLeaveComment}>
						Jätä kommentti
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
					message="Profile updated successfully!"
					type="success"
					onClose={() => setShowSuccessNotification(false)}
					duration={1500}
				/>
			)}
			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Error updating profile."
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={1500}
				/> 
			)}
		</>
	)
}

export default LeaveComment