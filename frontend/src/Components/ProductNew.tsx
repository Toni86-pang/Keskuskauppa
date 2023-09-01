import { ChangeEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"

export interface Product {
    product_id?: number
    user_id?: number
    title?: string
    category_id?: number
    subcategory_id?: number
    location?: string
    description?: string
    price?: number
}

interface Category {
	name: string
	id: number
}

function ProductNew() {

	// const [newProduct, setNewProduct] = useState<Product>()
	const [newTitle, setNewTitle] = useState<string>("")
	const [newDescription, setNewDescription] = useState<string>("")
	const [newPrice, setNewPrice] = useState<number>(0)
	const [newCategory, setNewCategory] = useState<string>("Kategoria")
	const [categoryId, setCategoryId] = useState<number>(0)
	const [newSubcategory, setNewSubcategory] = useState<string>("Alakategoria")
	const [subcategoryId, setSubcategoryId] = useState<number>(0)
	// const [chosenCategory, setChosenCategory] = useState<string>("")

	const categories: Category[] = [{ name: "Elektroniikka", id: 0 }, {name: "Vaatteet", id: 1}, {name: "Huonekalut", id: 2}]
	const subcategories: Category[] = [{ name: "Läppärit", id: 0 }, {name: "T-paidat", id: 1}, {name: "Sohvat", id: 2}]

	const navigate = useNavigate()

	const createNewProduct = async () => {
		const compiledProduct = {user_id: 2, title: newTitle, category_id: categoryId, subcategory_id: subcategoryId, location: "Oulu, 90570", description: newDescription, price: newPrice}
		console.log(compiledProduct)

		try {
			const response = await axios.post("/api/product/", compiledProduct, {
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (response.status === 200) {
				alert("Product creation success")
				navigate("/")
			}
		} catch (error) {
			console.error(error)
			alert("Something went wrong!")
		}
		navigate("/product")
	}

	const getCategory = (array: Array<{ name: string; id: number; }>, name: string) => {
		const filtered = array.filter((category) => category.name === name)
		console.log(filtered)
		console.log(filtered[0].id)
		return filtered[0].id
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
		const value = Number(event.target.value)
		setNewPrice(value)
	}

	const handleCategoryChange = (event: SelectChangeEvent) => {
		const categoryName = String(event.target.value)
		const categoryId = getCategory(categories, categoryName)
		setNewCategory(categoryName)
		setCategoryId(categoryId)
	}
	
	const handleSubcategoryChange = (event: SelectChangeEvent) => {
		const subcategoryName = String(event.target.value)
		const subcategoryId = getCategory(subcategories, subcategoryName)
		setNewSubcategory(subcategoryName)
		setSubcategoryId(subcategoryId)
	}

	const handleCancel = () => {
		navigate("/")
	}

	return (
		<Container sx={{ m: 1 }}>
			<h3>Uusi tuote</h3>
			<FormControl>
				<InputLabel style={{position: "relative"}} sx={{ mb: 2 }} id="title">Otsikko</InputLabel>
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
					<InputLabel style={{position: "relative"}} sx={{ mb: 2 }} id="price">Hinta</InputLabel>
					<TextField
						type="text"
						name="price"
						value={newPrice}
						onChange={handlePriceChange}
					/>
				</FormControl>
				<FormControl sx={{ mt: 2 }}>
					<InputLabel id="category_id">Kategoria</InputLabel>
					<Select
						labelId="category_id"
						id="category_id"
						value={newCategory}
						label="category_id"
						onChange={handleCategoryChange}>
						{categories.map(category => {
							return (
								<MenuItem key={category.id + category.name} value={category.name}>{category.name}</MenuItem>
							)
						})}
					</Select>				</FormControl>

				<FormControl sx={{ mt: 2 }}>
					<InputLabel id="subcategory_id">Alakategoria</InputLabel>
					<Select
						labelId="subcategory_id"
						id="subcategory_id"
						label="subcategory_id"
						onChange={handleSubcategoryChange}
						value={newSubcategory}>
						{subcategories.map(subcategory => {
							return (
								<MenuItem key={subcategory.id} value={subcategory.name}>{subcategory.name}</MenuItem>
							)
						})}
					</Select>
				</FormControl>
				<Container>
					<Button
						sx={{
							m: 1,
							bgcolor: "#6096ba",
							":hover": { bgcolor: "darkblue" }
						}}
						variant="contained"
						onClick={createNewProduct}>Lähetä</Button>
					<Button sx={{
						m: 1,
						bgcolor: "#6096ba",
						":hover": { bgcolor: "#d32f2f" },
					}}
					variant="contained"
					onClick={handleCancel}>
                    Peruuta
					</Button>
				</Container>
			</FormControl>
		</Container>
	)
}

export default ProductNew
