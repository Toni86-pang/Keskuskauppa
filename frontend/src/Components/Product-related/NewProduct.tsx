import { ChangeEvent, useContext, useEffect, useState } from "react"
import { useNavigate, redirect } from "react-router-dom"
import { Button, Box, Paper, Grid, Typography, Card, CardMedia, Input, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"
import { UserTokenContext } from "../../App"
import Notification from "../Verify-notification/Notification"
import { Category, Subcategory, User, initialState } from "../../Services-types/types"
import { fetchCategories, fetchIndividualSubcategory, fetchUser, newProduct } from "../../Services-types/services"

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
	const token = localStorage.getItem("token")
	if (!token) {
		return redirect("/")
	}
	return null
}

function NewProduct() {
	const [token] = useContext(UserTokenContext)
	const [user, setUser] = useState<User>(initialState)
	const [newTitle, setNewTitle] = useState<string>("")
	const [newDescription, setNewDescription] = useState<string>("")
	const [newPrice, setNewPrice] = useState<string>("")
	const [, setError] = useState<string>("")
	const [newCategory, setNewCategory] = useState<string>("")
	const [categoryId, setCategoryId] = useState<number>(0)
	const [newSubcategory, setNewSubcategory] = useState<string>("")
	const [subcategoryId, setSubcategoryId] = useState<number>(0)
	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Subcategory[]>([])
	const [newCity, setNewCity] = useState<string>("")
	const [newPostalCode, setNewPostalCode] = useState<string>("")
	const [productImage, setProductImage] = useState<File | null>(null)
	const [hidden, setHidden] = useState<boolean>(false)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)

	const navigate = useNavigate()

	useEffect(() => {
		const fetchInfo = async () => {
			if (!token) {
				setUser(initialState)
				return
			}

			const user = await fetchUser(token)
			setNewCity(user.city)
			setNewPostalCode(user.postal_code)
			if (user === undefined) {
				console.error("error fetching user")
				return
			}
			setUser(user)
		}
		fetchInfo()
	}, [token])

	useEffect(() => {
		fetchCategories().then((data) => {
			if (data === undefined) {
				console.error("error fetching categories")
				return
			}
			setCategories(data)
		})
	}, [])

	const fetchSubcategories = async (categoryId: number) => {
		fetchIndividualSubcategory(categoryId).then((data) => {
			if (data === undefined) {
				console.error("error fetching subcategories")
				return
			}
			setSubcategories(data)
		})
	}

	function timeout(delay: number) {
		return new Promise( res => setTimeout(res, delay) )
	}

	const createNewProduct = async () => {
		const formData = new FormData()
		if (productImage) {
			formData.append("product_image", productImage)
		}
		// Append other product data like title, description, etc.
		formData.append("user_id", user.user_id.toString())
		formData.append("title", newTitle)
		formData.append("category_id", categoryId.toString())
		formData.append("subcategory_id", subcategoryId.toString())
		formData.append("city", newCity)
		formData.append("postal_code", newPostalCode)
		formData.append("description", newDescription)
		formData.append("price", newPrice)
		formData.append("listed", "true") // assuming listed is always true

		try {
			const response = await newProduct(formData, token)
			if (response.status === 201) {
				setShowSuccessNotification(true)
				const newProductId = response.data.product_id
				await timeout(1500)
				navigate("/product/" + newProductId)
			}
		} catch (error) {
			// Handle errors
			console.error("Product creation error:", error)
			setShowErrorNotification(true)
		}
	}

	const getCategory = (array: Array<{ category_id: number; category_name: string }>, name: string) => {
		const filtered = array.filter((category) => category.category_name === name)
		return filtered[0].category_id
	}

	const getSubcategory = (array: Array<{ subcategory_id: number; subcategory_name: string }>, name: string) => {
		const filtered = array.filter((category) => category.subcategory_name === name)
		return filtered[0].subcategory_id
	}

	const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		if (value.length < 50) {
			setNewTitle(value)
		}
		
	}
	const handleDescChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		if (value.length < 599) {
			setNewDescription(value)
		}		
	}

	const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
		const inputValue = event.target.value
		if (inputValue === "") {
			setNewPrice("")
			setError("")
			return
		}

		const price = parseFloat(inputValue)

		if (isNaN(price) || price < 0) {
			setNewPrice("")
			setError("Invalid price input. Please enter a valid positive number.")
		} else {
			// Format the price to remove trailing zeros and unnecessary decimals
			const formattedPrice = price.toString()
			setNewPrice(formattedPrice)
			setError("")
		}
	}

	const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = (event.target.value)
		setNewCity(value)
	}

	const handlePostCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = (event.target.value)
		setNewPostalCode(value)
	}

	const handleCategoryChange = (event: SelectChangeEvent) => {
		const categoryName = String(event.target.value)
		const categoryId = getCategory(categories, categoryName)
		setNewCategory(categoryName)
		setCategoryId(categoryId)
		fetchSubcategories(categoryId)
	}

	const handleSubcategoryChange = (event: SelectChangeEvent) => {
		const subcategoryName = String(event.target.value)
		const subcategoryId = getSubcategory(subcategories, subcategoryName)
		setNewSubcategory(subcategoryName)
		setSubcategoryId(subcategoryId)
	}

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const fileInput = event.target
		if (fileInput && fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0]
			setProductImage(file)

			const reader = new FileReader()
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string)
			}
			reader.readAsDataURL(file)
		} else {
			setError("Kuvaa ei voi näyttää. Valitse toinen kuva.")
			setProductImage(null)
			setImagePreview(null)
		}
	}

	const handleCancel = () => {
		navigate("/profile")
	}

	const location = `${user.postal_code} ${user.city}`

	const handleCancelChange = () => {
		setNewCity(user.city)
		setNewPostalCode(user.postal_code)
		setHidden(false)
	}

	const styles = {
		section: {
			marginTop: "16px",
		},
		label: {
			marginBottom: "8px",
		},
		buttonContainer: {
			marginTop: "16px",
			display: "flex",
			justifyContent: "space-between",
		},
	}

	return (
		<Paper sx={{
			backgroundColor: "#f3f6fa",
			elevation: 5
		}}>
			<Grid container direction="row" spacing={1} justifyContent="center" alignItems="center" p={2}>
				<Typography sx={{fontSize: "1.2rem"}}>Uusi tuote</Typography>
			</Grid>
			<Grid container direction="row" spacing={2} justifyContent="center" alignItems="center" p={4}>
				<Grid item xs={5}>
					<InputLabel style={{ position: "relative" }} sx={{ mb: 2 }} id="title">Otsikko*</InputLabel>
					<TextField
						style={{ width: "300px" }}
						type="text"
						name="title"
						value={newTitle}
						onChange={handleTitleChange}
					/>
					<InputLabel style={{ position: "relative" }} sx={{ mb: 2 }} id="description">Kuvaus</InputLabel>
					<TextField
						style={{ width: "300px" }}
						multiline rows={5}
						type="text"
						name="description"
						
						value={newDescription}
						onChange={handleDescChange}
					/>
					<InputLabel style={{ position: "relative" }} sx={{ mb: 2 }} id="price">Hinta*</InputLabel>
					<TextField
						style={{ width: "300px" }}
						type="text"
						name="price"
						value={newPrice}
						onChange={handlePriceChange}
					/>
					<InputLabel id="Katergoria">Kategoria*</InputLabel>
					<Select
						style={{ width: "300px" }}
						labelId="category_id"
						id="category_id"
						value={newCategory}
						label="category_id"
						onChange={handleCategoryChange}>
						{categories?.map(category => {
							return (
								<MenuItem key={category.category_id + category.category_name} value={category.category_name}>{category.category_name}</MenuItem>
							)
						})}
					</Select>				
					{newCategory ? (
						<Box>
							<InputLabel id="Alakategoria">Alakategoria*</InputLabel>
							<Select
								style={{ width: "300px" }}
								labelId="subcategory_id"
								id="subcategory_id"
								label="subcategory_id"
								onChange={handleSubcategoryChange}
								value={newSubcategory}>
								{subcategories?.map(subcategory => {
									return (
										<MenuItem key={subcategory.subcategory_id + subcategory.subcategory_name} value={subcategory.subcategory_name}>{subcategory.subcategory_name}</MenuItem>
									)
								})}
							</Select>
						</Box>
					) : (
						<Box></Box>
					)}
				</Grid>
				<Grid item xs={5}>
					<InputLabel style={{ position: "relative" }} id="Kuvat">Lisää kuva:</InputLabel>
					<Input
						type="file"
						onChange={handleImageChange}
						inputProps={{ accept: "image/*" }}
					/>
					{productImage && (
						<Card sx={{ maxWidth: 300 }}>
							<CardMedia
								component="img"
								height="280"
								src={imagePreview || ""}
								alt="Selected Image"
							/>
						</Card>
					)}
					{!hidden ? (
						<Box pt={3} pr={3} pl={3}>
							<Typography sx={{fontSize: "0.9rem", p: 3}}>Lokaatio: {location}</Typography>
							<Button id="location" onClick={() => setHidden(true)}>Vaihda tuotteen lokaatio</Button>
						</Box>
					) : (
						<Box></Box>
					)}
					{hidden ? (
						<Box p={2}>
							<InputLabel style={{ position: "relative" }} sx={{ mb: 2 }} id="city">Kaupunki:</InputLabel>
							<TextField
								type="text"
								name="city"
								value={newCity}
								onChange={handleCityChange}
							/>
							<InputLabel style={{ position: "relative" }} sx={{ mb: 2 }} id="postalcode">Postinumero:</InputLabel>
							<TextField
								type="text"
								name="postal_code"
								value={newPostalCode}
								onChange={handlePostCodeChange}
							/>
							<Button
								sx={{
									m: 1,
								}}
								onClick={(handleCancelChange)}>
								Peruuta
							</Button>
						</Box>
					) : (
						<Box></Box>
					)}
				</Grid>
				<Grid item xs={5} style={styles.buttonContainer}>
					<Button
						sx={{
							m: 1
						}}
						variant="contained"
						color="error"
						onClick={handleCancel}>
						Peruuta
					</Button>
					<Button
						sx={{
							m: 1
						}}
						variant="contained"
						color="success"
						onClick={createNewProduct}>
						Lähetä
					</Button>
				</Grid>
			</Grid>
			{/* Success and error notifications */}
			{showSuccessNotification && (
				<Notification
					open={showSuccessNotification}
					message="Tuotteen lisäys onnistui!"
					type="success"
					onClose={() => setShowSuccessNotification(false)}
					duration={1500}
				/>
			)}
			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Tuotteen lisäys ei onnistunut. Täytithän kaikki kentät?"
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={1500}

				/>
			)}
		</Paper>
	)
}

export default NewProduct
