import { ChangeEvent, useEffect, useState } from "react"
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
	category_name: string
	category_id: number
}

interface Subcategory {
	subcategory_id: number
	subcategory_name: string
	category_id: number
}

function ProductNew() {

	const [newTitle, setNewTitle] = useState<string>("")
	const [newDescription, setNewDescription] = useState<string>("")
	const [newPrice, setNewPrice] = useState<number>(0)
	const [newCategory, setNewCategory] = useState<string>("")
	const [categoryId, setCategoryId] = useState<number>(0)
	const [newSubcategory, setNewSubcategory] = useState<string>("")
	const [subcategoryId, setSubcategoryId] = useState<number>(0)
	const [categories, setCategories] = useState<Category[]>([])
	const [subcategories, setSubcategories] = useState<Subcategory[]>([])
	// const [subOptions, setSubOptions] = useState<Subcategory[]>([])

	const navigate = useNavigate()

	const fetchCategories = async () => {
		try {
			const response = await axios.get("/api/category")
			console.log(response.data)
			setCategories(response.data)
		} catch (error) {
			console.error("error fetching categories", error)
		}
	}

	useEffect(() => {
		fetchCategories()
	}, [])

	const fetchSubcategories = async (categoryId: number) => {
		try {
			const response = await axios.get("/api/category/subcategory/" + categoryId)
			console.log(response.data)
			setSubcategories(response.data)
		} catch (error) {
			console.error("error fetching subcategories", error)
		}
	}

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

	const getCategory = (array: Array<{ category_id: number; category_name: string }>, name: string) => {
		const filtered = array.filter((category) => category.category_name === name)
		console.log(filtered)
		console.log(filtered[0].category_id)
		return filtered[0].category_id
	}

	const getSubcategory = (array: Array<{ subcategory_id: number; subcategory_name: string }>, name: string) => {
		const filtered = array.filter((category) => category.subcategory_name === name)
		console.log(filtered)
		console.log(filtered[0].subcategory_id)
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
		const value = Number(event.target.value)
		setNewPrice(value)
	}

	const handleCategoryChange = (event: SelectChangeEvent) => {
		const categoryName = String(event.target.value)
		const categoryId = getCategory(categories, categoryName)
		setNewCategory(categoryName)
		setCategoryId(categoryId)
		console.log(categoryId)
		fetchSubcategories(categoryId)
		// handleSubOptions()
	}
	
	const handleSubcategoryChange = (event: SelectChangeEvent) => {
		const subcategoryName = String(event.target.value)
		const subcategoryId = getSubcategory(subcategories, subcategoryName)
		setNewSubcategory(subcategoryName)
		setSubcategoryId(subcategoryId)
	}

	// const handleSubOptions = () => {
	// 	subcategories.map(sub => {
	// 		if(sub.category_id === categoryId) {
	// 			setSubOptions(() => ({
	// 				...subOptions, sub
	// 			}))
	// 			console.log(subOptions)
	// 		}})
	// }

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
						{categories?.map(category => {
							return (
								<MenuItem key={category.category_id + category.category_name} value={category.category_name}>{category.category_name}</MenuItem>
							)
						})}
					</Select>				</FormControl>

				{newCategory ? (
					<FormControl sx={{ mt: 2 }}>
						<InputLabel id="subcategory_id">Alakategoria</InputLabel>
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
				<Container>
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
				</Container>
			</FormControl>
		</Container>
	)
}

export default ProductNew
