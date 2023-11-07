import { useContext, useState } from "react"
import Dialog from "@mui/material/Dialog"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import DialogActions from "@mui/material/DialogActions"
import Button from "@mui/material/Button"
import DialogContent from "@mui/material/DialogContent"
import { UserTokenContext } from "../../../App"
import { ReviewComment } from "../../../Services-types/types"
import { leaveComment } from "../../../Services-types/services"
import Notification from "../../Verify-notification/Notification"

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
		<Box>
			<Dialog disableRestoreFocus open={isOpen} onClose={resetForm} >
				<Typography variant="h5" style={{textAlign: "center"}} mt={2}>Jätä kommentti</Typography>
				<DialogContent>
					<Box style={styles.section}>
						<Typography style={styles.label}>Kommentti:</Typography>
						<TextField
							autoFocus
							multiline
							value={comment}
							onChange={handleCommentChange}
							onKeyDown={handleKeyDown}
							fullWidth
						/>
					</Box>
					<DialogActions style={styles.buttonContainer}>
						<Button variant="contained" onClick={resetForm}>
							Peruuta
						</Button>
						<Button type="submit" variant="contained" color="success" onClick={handleLeaveComment}>
							Jätä kommentti
						</Button>
					</DialogActions>
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
		</Box>
	)
}

export default LeaveComment