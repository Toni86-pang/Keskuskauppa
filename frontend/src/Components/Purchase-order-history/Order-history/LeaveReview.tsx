import { ChangeEvent, SyntheticEvent, useState } from "react"
import { Dialog, TextField, Button, DialogActions, Rating, Typography, Box } from "@mui/material"
import StarIcon from "@mui/icons-material/Star"
import { Review, ReviewModalProps } from "../../../Services-types/types"
import { newReview, putReviewedTrue } from "../../../Services-types/services"
import Notification from "../../Verify-notification/Notification"

function LeaveReview({ isOpen, onClose, token, sale, sale_id, seller_id }: ReviewModalProps) {
	const [newDescription, setNewDescription] = useState<string>()
	const [newStars, setNewStars] = useState<number | null>(3)
	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)
	const [hover, setHover] = useState<number>(-1)
	const labels: { [index: string]: string } = {
		0.5: "Homma hukassa",
		1: "Ei riittävää yritystä",
		1.5: "Harmittava",
		2: "Ei ihan mennyt putkeen",
		2.5: "Parantamisen varaa on",
		3: "Keskikastia",
		3.5: "Kelpo kaupankävijä",
		4: "Tosi hyvä",
		4.5: "Homma hanskassa",
		5: "Supermyyjä",
	}
    
	function getLabelText(value: number) {
		return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`
	}
	
	const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
		setNewDescription(event.target.value)
	}

	const handleReviewSubmit = async () => {
		try {
			if(newStars !== null && sale !== undefined){
				const review: Review = {
					sales_id: sale_id,
					seller_id: seller_id,
					description: newDescription,
					stars: newStars,
					buyer_id: sale.buyer_id,
				}
				await newReview(review, token)
				if(sale.sales_id !== undefined){
					await putReviewedTrue(sale.sales_id, token)
				}
				setShowSuccessNotification(true) // Show success notification
				onClose()
			}
		} catch (error) {
			console.error("Error sending review", error)
			setShowErrorNotification(true)
		}
	}

	const handleCloseModal = () => {
		setNewDescription("")
		setNewStars(3)
		onClose()
	}

	const styles = {
		buttonContainer: {
			marginTop: "25px",
			display: "flex",
			justifyContent: "space-between",
		},
	}

	return (
		<>
			<Dialog open={isOpen} onClose={onClose} sx={{
				"& .MuiDialog-container": {
					"& .MuiPaper-root": {
						width: "100%",
						maxWidth: "600px",  // Set your width here
					},
				},
			}}>
				<Typography variant={"h5"} textAlign={"center"} p={3}>Jätä arvostelu</Typography>
				<Box style={{ maxHeight: "80vh", overflowY: "auto", padding: "16px" }}>
					<Box style={{ margin: "16px" }}>
						<TextField
							multiline rows={5}
							label="Kirjoita arvostelu..."
							value={newDescription}
							onChange={handleDescriptionChange}
							fullWidth
						/>
					</Box>
					<Box style={{textAlign: "center"}}>
						<Typography pt={2} pb={2}>Montako tähteä antaisit myyjälle tämän ostoksen perusteella?</Typography>
						<Rating
							name="hover-feedback"
							value={newStars}
							precision={0.5}
							getLabelText={getLabelText}
							onChange={(_event: SyntheticEvent<Element, Event>, newValue: number | null) => {
								setNewStars(newValue)
							}}
							onChangeActive={(_event, newHover) => {
								setHover(newHover)
							}}
							emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
						/>
						{newStars !== null && (
							<Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : newStars]}</Box>
						)}
					</Box>
					<DialogActions style={styles.buttonContainer}>
						<Button variant="contained" onClick={handleCloseModal}>
							Peruuta
						</Button>
						<Button variant="contained" color="success" onClick={handleReviewSubmit}>
							Lähetä
						</Button>
					</DialogActions>
				</Box>
			</Dialog>
			{/* Success and error notifications */}
			{showSuccessNotification && (
				<Notification
					open={showSuccessNotification}
					message="Arvostelu lähetetty!"
					type="success"
					onClose={() => setShowSuccessNotification(false)}
					duration={1500}
				/>
			)}
			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Arvostelun lähettäminen ei onnistunut."
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={1500}
				/>
			)}
		</>
	)
}

export default LeaveReview
