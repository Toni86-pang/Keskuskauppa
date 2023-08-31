import React, { useState } from "react"
import Dialog from "@mui/material/Dialog"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"

interface ModifiedProductData {
    title: string;
    category_id: number;
    subcategory_id: number;
    location: string;
    description: string;
    price: number;
  }

interface ModifyProductProps {
  open: boolean
  onClose: () => void
  onModify: (modifiedData: ModifiedProductData) => void
}

function UpdateProduct(props: ModifyProductProps) {
	const [modifiedData, setModifiedData] = useState({
		title: "",
		category_id: 0,
		subcategory_id: 0,
		location: "",
		description: "",
		price: 0
	})

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		setModifiedData(prevData => ({
			...prevData,
			[name]: value
		}))
	}

	const handleModify = () => {
		props.onModify(modifiedData)
		props.onClose()
	}

	return (
		<Dialog open={props.open} onClose={props.onClose}>
			<div>
				<TextField
					name="title"
					label="Title"
					value={modifiedData.title}
					onChange={handleInputChange}
				/>
				<TextField
					name="categoryID"
					label="Category ID"
					value={modifiedData.category_id}
					onChange={handleInputChange}
					type="number"
				/>

				<Button onClick={handleModify}>Modify</Button>
				<Button onClick={props.onClose}>Cancel</Button>
			</div>
		</Dialog>
	)
}
export default UpdateProduct