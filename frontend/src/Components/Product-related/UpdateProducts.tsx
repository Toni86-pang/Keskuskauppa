import { useEffect, useState } from "react"
import { Dialog, TextField, DialogActions, Typography, DialogContent, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Box, Input, Card, CardMedia } from "@mui/material"
import { Category, UpdateProductModalProps } from "../../Services-types/types"
import { fetchCategories, fetchSubcategories, updateProduct } from "../../Services-types/services"
import Notification from "../Verify-notification/Notification"

function UpdateProductModal({isOpen, onClose, token, product }: UpdateProductModalProps) {
	const [updatedTitle, setUpdatedTitle] = useState(product.title)
	const [updatedCity, setUpdatedCity] = useState(product.city)
	const [updatedPostalCode, setUpdatedPostalCode] = useState(product.postal_code)
	const [updatedDescription, setUpdatedDescription] = useState(product.description)
	const [updatedPrice, setUpdatedPrice] = useState(product.price)
	const [selectedImage, setSelectedImage] = useState<File | null>(null)
	const [imagePreview, setImagePreview] = useState<string | null>(null)

	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Category[]>([])	
	const [selectedCategoryId, setSelectedCategoryId] = useState(product.category_id)
	const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(product.subcategory_id)
	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)
	const [error, setError] = useState("")
	

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
		const fileInput = event.target
		if (fileInput && fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0]
			setSelectedImage(file)
		
			const reader = new FileReader()
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string)
			}
			reader.readAsDataURL(file)
		} else {
			setError("Invalid image file. Please select a valid image.")
			setSelectedImage(null)
			setImagePreview(null)
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
			// update product database
			await updateProduct(product.product_id, formData, token)

			// if no new product image, update the product page with new product data without image
			if(!selectedImage) {
				setShowSuccessNotification(true)
				onClose({ ...product, title: updatedTitle, 
					category_id: selectedCategoryId, 
					subcategory_id: selectedSubcategoryId, 
					city: updatedCity, 
					postal_code: updatedPostalCode, 
					description: updatedDescription,
					price: updatedPrice })
			} else { 	
				// Create a Filereader to read new image asynchronously
				const reader = new FileReader()	

				// This function is called when the image is loaded below
				reader.onload = (event) => {
					// encode the file into base64 string
					const imageDataURL = event.target?.result as string

					setShowSuccessNotification(true)

					onClose({ ...product, title: updatedTitle, 
						category_id: selectedCategoryId, 
						subcategory_id: selectedSubcategoryId, 
						city: updatedCity, 
						postal_code: updatedPostalCode, 
						description: updatedDescription,
						price: updatedPrice,  
						product_image: imageDataURL })				
				}
				// read the file
				reader.readAsDataURL(selectedImage as File)
			}
			
		} catch (error) {
			console.error("Error updating product:", error)
			setShowErrorNotification(true) 
		}
	}

	const handleCloseModal = () => {
		onClose(product)
	}

	
	const styles = {
		section: {
			marginTop: "16px",
		},
		label: {
			marginBottom: "8px",
		},
		buttonContainer: {
			marginTop: "15px",
			display: "flex",
			justifyContent: "space-between",
		},
	}

	return (
		<>
			<Dialog open={isOpen} onClose={handleCloseModal}>
				<Typography variant={"h5"} textAlign={"center"} p={3}>Muokkaa tuotetta</Typography>
				<DialogContent>
					<Box p={2}>
						<FormControl >
							<FormControl style={{ margin: "6px" }}>
								<TextField
									style={{ margin: "6px" }}
									label="Nimi"
									value={updatedTitle}
									onChange={handleTitleChange}
								/>
								<TextField
									style={{ margin: "6px" }}
									multiline rows={5}
									label="Kuvailu"
									value={updatedDescription}
									onChange={handleDescriptionChange}
								/>
								<TextField
									style={{ margin: "6px" }}
									label="Kaupunki"
									value={updatedCity}
									onChange={handleCityChange}
								/>
								<TextField
									style={{ margin: "6px" }}
									label="Postinumero"
									value={updatedPostalCode}
									onChange={handlePostalCodeChange}
								/>
								<TextField
									style={{ margin: "6px" }}
									label="Hinta"
									value={updatedPrice}
									onChange={handlePriceChange}
								/>
								{error && <div style={{ color: "red" }}>{error}</div>}
							</FormControl>
							<FormControl fullWidth>
								<Box p={2}>
									<InputLabel style={{ position: "relative" }}>Kategoria</InputLabel>
									<Select
										style={{ width: "350px" }}
										value={selectedCategoryId}
										onChange={handleCategoryChange}
									>
										{categories.map(category => (
											<MenuItem key={category.category_id} value={category.category_id}>
												{category.category_name}
											</MenuItem>
										))}
									</Select>
								</Box>
								<Box p={2}>
									<InputLabel style={{ position: "relative" }}>Alakategoria</InputLabel>
									<Select
										style={{ width: "350px" }}
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
								</Box>
							</FormControl>
							<FormControl fullWidth>
								<Box pl={3} pr={3} pb={3}>
									<Typography style={{ position: "relative" }} pt={2} pb={1}>Muokkaa kuvaa:</Typography>
									<Input
										type="file"
										name="product_image"
										onChange={handleImageChange}
										inputProps={{ accept: "image/*" }}
									/>
								
									{selectedImage && (
										<Card sx={{ maxWidth: 300 }}>
											<CardMedia
												component="img"
												height="300"
												src={imagePreview || ""}
												alt="Selected Image"
											/>
										</Card>
									)}
								</Box>
							</FormControl>

							<DialogActions style={styles.buttonContainer}>
								<Button variant="contained" onClick={handleCloseModal}>
									Peruuta
								</Button>
								<Button variant="contained" color={"success"} onClick={handleUpdateSubmit}>
									Muokkaa
								</Button>

							</DialogActions>
						</FormControl>
					</Box>
				</DialogContent>
			</Dialog>
			{/* Success and error notifications */}
			{showSuccessNotification && (
				<Notification
					open={showSuccessNotification}
					message="Tuote päivitetty!"
					type="success"
					onClose={() => setShowSuccessNotification(false)}
					duration={1000}
				/>
			)}
			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Tuotteen päivitys ei onnistunut."
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={1000}
				/>
			)}
		</>
	)
}

export default UpdateProductModal