import { useState } from "react"
import axios from "axios"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

interface DeleteButtonprops {
	id: number
	onDelete: () => void
}

export default function DeleteButton({ id, onDelete }: DeleteButtonprops) {
	console.log("DeleteButton id:", id)
	const [dialogOpen, setDialogOpen] = useState(false)

	const handleDelete =async () => {
		try {
			await axios.delete(`/api/product/delete/${id}`)
			onDelete()
		} catch (error){
			console.error("error deleteting product", error)
		}
	}
	return (
		<div>
			<Button variant="outlined" color="secondary" onClick={() => setDialogOpen(true)}>
				Delete Product
			</Button>
			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
				<DialogTitle>Delete Product</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this product? This cannot be undone.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={()=> setDialogOpen(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDelete} color="secondary"> 
					Delete
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
