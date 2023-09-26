import { useState } from "react"
import Dialog from "@mui/material/Dialog"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import axios from "axios"
import Notification from "./Notification"

interface UpdateProductModalProps {
	isOpen: boolean
	onClose: () => void
	productId: number
	title: string
	category_id: number
	subcategory_id: number
	city: string
	postal_code: string
	description: string
	price: number
}

function UpdateProductModal({
	isOpen,
	onClose,
	productId,
	title,
	category_id,
	subcategory_id,
	city,
	postal_code,
	description,
	price
}: UpdateProductModalProps) {
	const [updatedTitle, setUpdatedTitle] = useState(title)
	const [updatedCategory, setUpdatedCategory] = useState(category_id)
	const [updatedSubcategory, setUpdatedSubcategory] = useState(subcategory_id)
	const [updatedCity, setUpdatedCity] = useState(city)
	const [updatedPostalCode, setUpdatedPostalCode] = useState(postal_code)
	const [updatedDescription, setUpdatedDescription] = useState(description)
	const [updatedPrice, setUpdatedPrice] = useState(price)

	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUpdatedTitle(event.target.value)
	}
	const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value
		const category = parseFloat(inputValue)
		if (!isNaN(category)) {
			setUpdatedCategory(category)
		} else {
			console.error("Invalid price input:", inputValue)
		}
	}
	const handleSubCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value
		const subcategory = parseFloat(inputValue)
		if (!isNaN(subcategory)) {
			setUpdatedSubcategory(subcategory)
		} else {
			console.error("Invalid price input:", inputValue)
		}
	}
	const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUpdatedCity(event.target.value)
	}
	const handlePostalCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUpdatedPostalCode(event.target.value)
	}
	const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUpdatedDescription(event.target.value)
	}
	const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value
		const price = parseFloat(inputValue)
		if (!isNaN(price)) {
			setUpdatedPrice(price)
		} else {
			console.error("Invalid price input:", inputValue)
		}
	}

	const handleUpdateSubmit = async () => {
		try {
			const updatedData = {
				title: updatedTitle,
				category_id: updatedCategory,
				subcategory_id: updatedSubcategory,
				city: updatedCity,
				postal_code: updatedPostalCode,
				description: updatedDescription,
				price: updatedPrice,
			}
			await axios.put(`/api/product/update/${productId}`, updatedData)
			setShowSuccessNotification(true) // Show success notification
			onClose()
		} catch (error) {
			console.error("Error updating product", error)
			setShowErrorNotification(true) // Show error notification
		}
	}




	const handleCloseModal = () => {
		onClose()
	}

	return (
		<>
			<Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
				<div style={{ maxHeight: "80vh", overflowY: "auto", padding: "16px" }}>
					<div style={{ margin: "16px" }}>
						<TextField
							label="Title"
							value={updatedTitle}
							onChange={handleTitleChange}
						/>
						<TextField
							label="Category"
							value={updatedCategory}
							onChange={handleCategoryChange}
						/>
						<TextField
							label="subCaterogy"
							value={updatedSubcategory}
							onChange={handleSubCategoryChange}
						/>
					</div>
					<div style={{ margin: "16px" }}>
						<TextField
							label="City"
							value={updatedCity}
							onChange={handleCityChange}
						/>
						<TextField
							label="Postalcode"
							value={updatedPostalCode}
							onChange={handlePostalCodeChange}
						/>
						<TextField
							label="Description"
							value={updatedDescription}
							onChange={handleDescriptionChange}
						/>
					</div>
					<div style={{ margin: "16px" }}>
						<TextField
							label="Price"
							value={updatedPrice}
							onChange={handlePriceChange}
						/>
					</div>
					<div style={{ margin: "16px" }}>
						<Button variant="outlined" onClick={handleUpdateSubmit}>
							Päivitä
						</Button>
						<Button variant="outlined" onClick={handleCloseModal}>
							Cancel
						</Button>
					</div>
				</div>
			</Dialog>
			{/* Success and error notifications */}
			{showSuccessNotification && (
				<Notification
					open={showSuccessNotification}
					message="Product updated successfully!"
					type="success"
					onClose={() => setShowSuccessNotification(false)}
					duration={5000}
				/>
			)}
			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Error updating product."
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={5000}
				/> 
			)}
		</>
	)
}

export default UpdateProductModal
