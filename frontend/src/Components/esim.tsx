import { ChangeEvent, useContext, useEffect, useState } from "react"
import { useNavigate, redirect } from "react-router-dom"
import { Button, Container, FormControl, Input, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"
import { UserTokenContext } from "../App"
import { Category, Subcategory, User, initialState } from "../types"
import { fetchCategories, fetchIndividualSubcategory, fetchUser, newProduct } from "../services"

export async function loader() {
	const token = localStorage.getItem("token")
	if(!token){
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

	const navigate = useNavigate()

	useEffect(() => {
		const fetchInfo = async () => {
			if(!token){
				setUser(initialState)
				return
			}
	
			const user = await fetchUser(token)
	
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
				console.log("Product creation success")
				navigate("/profile")
			}
		} catch (error) {
		// Handle errors
			console.error("Product creation error:", error)
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
		setNewTitle(value)
	}
	const handleDescChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setNewDescription(value)
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

	const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0]
		if (file) {
			setProductImage(file)
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

	
	return (
		<Container sx={{ m: 1 }}>
			<h3>Uusi tuote</h3>
			<FormControl>
				<InputLabel style={{position: "relative"}} sx={{ mb: 2 }} id="title">Otsikko*</InputLabel>
				<TextField
					type="text"
					name="title"
					value={newTitle}
					onChange={handleTitleChange}
				/>
				<InputLabel style={{position: "relative"}} sx={{ mb: 2 }} id="description">Kuvaus</InputLabel>
				<TextField
					multiline rows={5}
					type="text"
					name="description"
					value={newDescription}
					onChange={handleDescChange}
				/>
				
				<FormControl>
					<InputLabel style={{position: "relative"}} sx={{ mb: 2 }} id="price">Hinta*</InputLabel>
					<TextField
						type="text"
						name="price"
						value={newPrice}
						onChange={handlePriceChange}
					/>
				</FormControl>
				<FormControl>
					<InputLabel style={{position: "relative"}} id="Kuvat">Lisää kuva:</InputLabel>
					<Input
						type="file"
						onChange={handleImageChange}
						inputProps={{ accept: "image/*" }}	
					/>
				</FormControl>
				<FormControl sx={{ mt: 2 }}>
					<InputLabel id="Katergoria">Kategoria*</InputLabel>
					<Select
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
					</Select>				</FormControl>
				
				{newCategory ? (
					<FormControl sx={{ mt: 2 }}>
						<InputLabel id="Alakategoria">Alakategoria*</InputLabel>
						<Select
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
					</FormControl>

				) : (
					<></>
				)}
				{!hidden ? (
					<FormControl>
						<Container >Lokaatio: {location}</Container>
						<Button id="location" onClick={() => setHidden(true)}>Vaihda tuotteen lokaatio</Button>
					</FormControl>
				):(
					<></>
				)}
				{hidden ? (
					<FormControl>
						<InputLabel style={{position: "relative"}} sx={{ mb: 2 }} id="city">Kaupunki:</InputLabel>
						<TextField
							type="text"
							name="city"
							value={newCity}
							onChange={handleCityChange}
						/>
						<InputLabel style={{position: "relative"}} sx={{ mb: 2 }} id="postalcode">Postinumero:</InputLabel>
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
					</FormControl>
				):(
					<></>
				)}
				<Button
					sx={{
						m: 1,
						bgcolor: "#6096ba",
						":hover": { bgcolor: "darkblue" }
					}}
					variant="contained"
					onClick={createNewProduct}>
							Lähetä
				</Button>
				<Button 
					sx={{
						m: 1,
						bgcolor: "#6096ba",
						":hover": { bgcolor: "#d32f2f" },
					}}
					variant="contained"
					onClick={handleCancel}>
							Peruuta
				</Button>
			</FormControl>
		</Container>
	)
}

export default NewProduct
