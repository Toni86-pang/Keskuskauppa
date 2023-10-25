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

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleLeaveComment()
		}
	}

	const handleLeaveComment = async () => {
		try {
			const commentData: ReviewComment = {
				comment: comment,
				review_id: reviewId
			}
			await leaveComment(commentData, token)
			close()
		} catch (error) {
			console.error("Error leaving comment", error)
			setShowErrorNotification(true)
		}
	}

	return (
		<>
			<Dialog disableRestoreFocus open={isOpen} onClose={resetForm} >
				<DialogTitle>Jätä kommentti</DialogTitle>
				<DialogContent>
					<div style={styles.section}>
						<div style={styles.label}>Kommentti:</div>
						<TextField
							autoFocus
							multiline
							label="Kommentti"
							value={comment}
							onChange={handleCommentChange}
							onKeyDown={handleKeyDown}
							fullWidth
						/>
					</div>

					<div style={styles.buttonContainer}>
						<Button type="submit" variant="outlined" onClick={handleLeaveComment}>
							Jätä kommentti
						</Button>
						<Button variant="outlined" onClick={resetForm}>
							Peruuta
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{/* Error notification */}

			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Error leaving comment."
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={1500}
				/>
			)}
		</>
	)
}

export default LeaveComment