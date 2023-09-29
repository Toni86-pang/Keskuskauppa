import { useState } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { DeleteButtonprops } from "../types"

export default function DeleteButton({ id, onDelete }: DeleteButtonprops) {
	console.log("DeleteButton id:", id)
	const [dialogOpen, setDialogOpen] = useState(false)

	return (
		<div>
			<Button variant="outlined" color="secondary" onClick={() => setDialogOpen(true)}>
				Poista tuote
			</Button>
			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
				<DialogTitle>Delete Product</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Haluatko varmasti poistaa tuotteen pysyvästi?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={()=> setDialogOpen(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={onDelete} color="secondary"> 
					Delete
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
