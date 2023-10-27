import { useEffect, useState } from "react"
import { Dialog, TextField, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Box, Input, Card, CardMedia } from "@mui/material"
import { Category, UpdateProductModalProps } from "../../Services-types/types"
import { fetchCategories, fetchSubcategories, updateProduct } from "../../Services-types/services"
import Notification from "../Verify-notification/Notification"
import { useNavigate } from "react-router-dom"

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
	price
	
}: UpdateProductModalProps) {
	const [updatedTitle, setUpdatedTitle] = useState(title)
	const [updatedCity, setUpdatedCity] = useState(city)
	const [updatedPostalCode, setUpdatedPostalCode] = useState(postal_code)
	const [updatedDescription, setUpdatedDescription] = useState(description)
	const [updatedPrice, setUpdatedPrice] = useState(price)
	const [selectedImage, setSelectedImage] = useState<File | null>(null)
	const [, setImagePreview] = useState<string | null>(null)

	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Category[]>([])	
	const [selectedCategoryId, setSelectedCategoryId] = useState(category_id)
	const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(subcategory_id)
	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)
	const [error, setError] = useState("")
	
	const navigate = useNavigate()

	useEffect(() => {
		async function fetchCategoryData() {
			try {
				const data = await fetchCategories()
				setCategories(data)
			} catch (error) {
				console.error("Error fetching categories", error)
			}
		}
	
		async function fetchSubcategoryData() {
			try {
				const data = await fetchSubcategories() 
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
		if (inputValue === ""){
			setUpdatedPrice ("")
			setError("")
			return
		}

		const price = parseFloat(inputValue)
		
		if (isNaN(price) || price < 0) {
			setUpdatedPrice("")
			setError("Invalid price input. Please enter a valid positive number.")
		} else {
			const formattedPrice = price.toFixed(0)
			setUpdatedPrice(formattedPrice)
			setError("")
		}
	}

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0]
	
		if (file) {
			if (file.type.startsWith("image/")) {
				setSelectedImage(file)
	
				// Display a preview of the selected image
				const reader = new FileReader()
				reader.onload = (e) => {
					setImagePreview(e.target!.result as string)
				}
				reader.readAsDataURL(file)
			} else {
				setError("Invalid image file. Please select a valid image.")
			}
		}
	}

	const handleUpdateSubmit = async () => {
		try {
			const formData = new FormData()
			formData.append("title", updatedTitle)
			formData.append("category_id", String(selectedCategoryId))
			formData.append("subcategory_id", String(selectedSubcategoryId))
			formData.append("city", updatedCity)
			formData.append("postal_code", updatedPostalCode)
			formData.append("description", updatedDescription)
			formData.append("price", String(updatedPrice))
			if (selectedImage) {
				formData.append("product_image", selectedImage) // Append the image to FormData
			}
	
			await updateProduct(productId, formData, token)
			setShowSuccessNotification(true) 
			onClose()
			navigate("/profile")
		} catch (error) {
			console.error("Error updating product:", error)
			setShowErrorNotification(true) 
		}
	}

	const handleCloseModal = () => {
		onClose()
	}

	return (
		<>
			<Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
				<Box sx={{ maxHeight: "80vh", overflowY: "auto", p: 2 }}>
					<FormControl sx={{ margin: 2 }}>
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
						<FormControl sx={{ margin: 2 }}>
							<InputLabel htmlFor="product_image">Lisää kuva</InputLabel>
							<Input
								type="file"
								name="product_image"
								onChange={handleImageChange}
								inputProps={{ accept: "image/*" }}
							/>
						</FormControl>
						{selectedImage && (
							<Card sx={{ maxWidth: 345 }}>
								<CardMedia
									component="img"
									height="140"
									image={URL.createObjectURL(selectedImage)}
									alt="Selected Image"
								/>
							</Card>
						)}
					</FormControl>
				</Box>
				<FormControl sx={{ margin: 2 }}>
					<FormControl style={{ margin: "16px" }}>
						<TextField
							label="Nimi"
							value={updatedTitle}
							onChange={handleTitleChange}
						/>
						<TextField
							label="Kuvailu"
							value={updatedDescription}
							onChange={handleDescriptionChange}
						/>
					</FormControl>

					<FormControl style={{ margin: "16px" }}>
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
							label="Hinta"
							value={updatedPrice}
							onChange={handlePriceChange}
						/>
						{error && <div style={{ color: "red" }}>{error}</div>}
					</FormControl>

					<FormControl style={{ margin: "16px" }}>
						<Button variant="outlined" onClick={handleUpdateSubmit}>
							Päivitä
						</Button>
						<Button variant="outlined" onClick={handleCloseModal}>
							Peruuta
						</Button>
					</FormControl>
				</FormControl>
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