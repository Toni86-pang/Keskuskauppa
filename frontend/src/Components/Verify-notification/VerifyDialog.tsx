import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { VerifyProps } from "../../Services-types/types"

const DEFAULT_OK = "OK"
const DEFAULT_CANCEL = "PERUUTA"
const ACCEPT_BUTTON_GREEN = true

/*
	VerifyDialog takes the following props:
	titleText: The title of the dialog - optional
	messageText: The message that is displayed - necessary
	isOpen: boolean whether the VerifyDialog is open or not - necessary
	setOpen: function from the calling component that sets the visibility - necessary
	onAccept: function that gets called when the user accepts the dialog - necessary
	acceptButtonGreen: boolean, true if green button, false if red - optional default true
	onDecline: function that gets called when the use declines the dialog - optional
	acceptButtonText: text that is shown on the accept button - optional if omitted shows const DEFAULT_OK 
	declineButtonText: text that is shown on the decline button -optional if omitted shows const DEFAULT_CANCEL
	preformattedText: text that is shown after messageText. Keeps linebreaks, tabs and other whitespace. - optional


*/

export default function VerifyDialog(props: VerifyProps) {

	const handleAccept = () => {
		onAccept()
		props.setOpen(false)
	}
	const handleDecline = () => {
		if(onDecline) {
			onDecline()
		}
		props.setOpen(false)
	}

	const messageText = props.messageText
	const titleText = props.titleText??""
	const onAccept = props.onAccept
	const onDecline = props.onDecline?props.onDecline:null
	const acceptButtonText = props.acceptButtonText??DEFAULT_OK
	const acceptButtonGreen = props.acceptButtonGreen??ACCEPT_BUTTON_GREEN
	const declineButtonText = props.declineButtonText??DEFAULT_CANCEL
	const preformattedText = props.preformattedText

	return (
		<Dialog	open={props.isOpen}	>
			<DialogTitle>
				{titleText}
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{messageText}
					{!!preformattedText && <pre>{preformattedText}</pre>}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" onClick={handleDecline}>{declineButtonText} </Button>
				<Button variant="contained" color={acceptButtonGreen?"success":"error"} onClick={handleAccept}>{acceptButtonText}</Button>
			</DialogActions>
		</Dialog>

	)
}
