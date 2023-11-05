import { useState } from "react"
import { Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import { DeleteButtonprops } from "../../Services-types/types"

export default function DeleteButton({  onDelete }: DeleteButtonprops) {
	
	const [dialogOpen, setDialogOpen] = useState(false)

	return (
		<Box>
			<Button variant="contained" color="error" onClick={() => setDialogOpen(true)}>
				Poista tuote
			</Button>
			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
				<DialogTitle>Poista tuote</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Haluatko varmasti poistaa tuotteen pysyvästi?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" onClick={()=> setDialogOpen(false)}>
						Peruuta
					</Button>
					<Button variant="contained" color="error" onClick={onDelete}> 
						Poista
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	)
}
