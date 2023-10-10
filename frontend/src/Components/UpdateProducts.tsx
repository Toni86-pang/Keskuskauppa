import { useState } from "react"
import { Dialog, TextField, Button, Select, MenuItem, SelectChangeEvent } from "@mui/material"
import { Category, Subcategory, UpdateProductModalProps } from "../types"
import { fetchCategories, fetchSubcategoriesByMainCategory, updateProduct } from "../services"
import Notification from "./Notification"

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
	price,
	
}: UpdateProductModalProps) {
	const [updatedTitle, setUpdatedTitle] = useState(title)
	const [updatedCategory, setUpdatedCategory] = useState(category_id)
	const [updatedSubcategory, setUpdatedSubcategory] = useState(subcategory_id)
	const [updatedCity, setUpdatedCity] = useState(city)
	const [updatedPostalCode, setUpdatedPostalCode] = useState(postal_code)
	const [updatedDescription, setUpdatedDescription] = useState(description)
	const [updatedPrice, setUpdatedPrice] = useState(price)
	const [subcategories, setSubcategories] = useState<Subcategory[]>([])
	const [categories, setCategories] = useState<Category[]>([])


	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUpdatedTitle(event.target.value)
	}

	const handleCategoryChange = (event: SelectChangeEvent<number>) => {
		const categoryId = event.target.value as number
		setUpdatedCategory(categoryId)

		// Fetch subcategories based on the selected category
		fetchCategories().then((data) => {
			if (data === undefined) {
				console.error("error fetching categories")
				return
			}
			setCategories(data)
		})
	}


	const handleSubcategoryChange = (event: SelectChangeEvent<number>) => {
		const subcategoryId = Number(event.target.value) // Convert the value to a number
		if (!isNaN(subcategoryId)) { // Check if the conversion was successful
			setUpdatedSubcategory(subcategoryId)
		} else {
			console.error("Invalid subcategory ID input:", event.target.value)
		}
	
		fetchSubcategoriesByMainCategory(subcategoryId).then((data) => {
			setSubcategories(data)

			// Set the first subcategory as selected
			if (data.length > 0) {
				setUpdatedSubcategory(data[0].category_id)
			} else {
				console.error("Invalid category ID input:", event.target.value)
			}
		})
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
			updateProduct(productId, updatedData)
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
						{/* Dropdown for Categories */}
						<Select
							label="Category"
							value={updatedCategory}
							onChange={handleCategoryChange}
						>
							{categories.map((category) => (
								<MenuItem key={category.category_id} value={category.category_id}>
									{category.category_name}
								</MenuItem>
							))}
						</Select>
						{/* Dropdown for Subcategories */}
						<Select
							label="Subcategory"
							value={updatedSubcategory}
							onChange={handleSubcategoryChange}
						>
							{subcategories.map((subcategory) => (
								<MenuItem key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
									{subcategory.subcategory_name}
								</MenuItem>
							))}
						</Select>

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
							label="Kuvailu"
							value={updatedDescription}
							onChange={handleDescriptionChange}
						/>
					</div>
					<div style={{ margin: "16px" }}>
						<TextField
							label="Hinta"
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
					message="Tuote päivitetty!"
					type="success"
					onClose={() => setShowSuccessNotification(false)}
					duration={1500}
				/>
			)}
			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Tuotteen päivitys ei onnistunut."
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={1500}
				/>
			)}
		</>
	)
}

export default UpdateProductModal
