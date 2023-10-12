import { useEffect, useState } from "react"
import { Dialog, TextField, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material"
import { Category, UpdateProductModalProps } from "../types"
import { fetchCategories, fetchSubcategories, updateProduct } from "../services"
import Notification from "./Notification"

function UpdateProductModal({
	isOpen,
	onClose,
	token,
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
	const [updatedCity, setUpdatedCity] = useState(city)
	const [updatedPostalCode, setUpdatedPostalCode] = useState(postal_code)
	const [updatedDescription, setUpdatedDescription] = useState(description)
	const [updatedPrice, setUpdatedPrice] = useState(price)

	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Category[]>([])	
	const [selectedCategoryId, setSelectedCategoryId] = useState(category_id)
	const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(subcategory_id)
	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)

	useEffect(() => {
		async function fetchCategoryData() {
			try {
				const data = await fetchCategories() // Fetch categories from your API
				setCategories(data)
			} catch (error) {
				console.error("Error fetching categories", error)
			}
		}
	
		async function fetchSubcategoryData() {
			try {
				const data = await fetchSubcategories() // Fetch subcategories from your API
				setSubcategories(data)
			} catch (error) {
				console.error("Error fetching subcategories", error)
			}
		}
		fetchCategoryData()
		fetchSubcategoryData()
	}, [])
	

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUpdatedTitle(event.target.value)
	}

	const handleCategoryChange = (event: SelectChangeEvent<number>) => {
		const selectedCategoryId = event.target.value as number
		setSelectedCategoryId(selectedCategoryId)
	}

	const handleSubCategoryChange = (event: SelectChangeEvent<number>) => {
		const selectedSubcategoryId = event.target.value
		setSelectedSubcategoryId(Number(selectedSubcategoryId))
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
				category_id: selectedCategoryId,
				subcategory_id: selectedSubcategoryId,
				city: updatedCity,
				postal_code: updatedPostalCode,
				description: updatedDescription,
				price: updatedPrice,
			}
			await updateProduct(productId, updatedData, token)
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
							label="Nimi"
							value={updatedTitle}
							onChange={handleTitleChange}
						/>
						<FormControl>
							<InputLabel>Kategoria</InputLabel>
							<Select
								value={selectedCategoryId}
								onChange={handleCategoryChange}
							>
								{categories.map(category => (
									<MenuItem key={category.category_id} value={category.category_id}>
										{category.category_name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl>
							<InputLabel>Alakategoria</InputLabel>
							<Select
								value={selectedSubcategoryId}
								onChange={handleSubCategoryChange}
							>
								{subcategories
									.filter(subcategory => subcategory.category_id === selectedCategoryId)
									.map(subcategory => (
										<MenuItem key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
											{subcategory.subcategory_name}
										</MenuItem>
									))}
							</Select>
						</FormControl>
					</div>
					<div style={{ margin: "16px" }}>
						<TextField
							label="Kaupunki"
							value={updatedCity}
							onChange={handleCityChange}
						/>
						<TextField
							label="Postinumero"
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
							Peruuta
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
