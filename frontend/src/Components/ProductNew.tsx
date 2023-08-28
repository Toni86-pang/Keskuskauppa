import { ChangeEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Button, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"



export interface Product {
    product_id?: number
    user_id?: number
    title?: string
    category_id?: string
    subcategory_id?: string
    location?: string
    description?: string
    price?: number
}

const initialState: Product = {
	user_id: 0,
	title: "",
	category_id: "",
	subcategory_id: "",
	location: "",
	description: "",
	price: 0
}

function ProductNew() {

	const [newProduct, setNewProduct] = useState<Product>(initialState)

	const { user_id, title, category_id, subcategory_id, location, description, price } = newProduct

	const navigate = useNavigate()

	const createNewProduct = async () => {

		try {
			const response = await axios.post("/api/users/register", newProduct, {
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (response.status === 200) {
				navigate("/")
				alert("Product creation success")
			} else if (response.status === 500) {
				setNewProduct(initialState)
				alert("Error creating product.")
			} else {
				setNewProduct(initialState)
				throw new Error("Something went wrong!")
			}
		} catch (error) {
			console.error(error)
			alert("Something went wrong!")
		}

	}
	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target
		setNewProduct(() => ({
			...newProduct, [name]: value
		}))
	}

	const handleDropdownChange = (event: SelectChangeEvent) => {
		const { name, value } = event.target
		setNewProduct(() => ({
			...newProduct, [name]: value
		}))
	}

	const handleCancel = () => {
		setNewProduct(initialState)
	}
	return (
		<Container sx={{ m: 1 }}>
			<FormControl fullWidth>
				<TextField
					type="text"
					placeholder="your name"
					name="name"
					value={name}
					onChange={handleInputChange}
				/>

				<TextField
					type="email"
					placeholder="your email"
					name="email"
					value={email}
					onChange={handleInputChange}
				/>

				<InputLabel id="subcategory_id">Alakategoria</InputLabel>
				<Select
					labelId="subcategory_id"
					id="subcategory_id"
					value={subcategory_id}
					label="Age"
					onChange={handleDropdownChange}
				>
					<MenuItem value={1}>Laptops</MenuItem>
					<MenuItem value={2}>T-shirts</MenuItem>
					<MenuItem value={3}>Sofas</MenuItem>
				</Select>

				<InputLabel id="category_id">Kategoria</InputLabel>
				<Select
					labelId="category_id"
					id='category_id'
					value={category_id}
					label="Age"
					onChange={handleDropdownChange}
				>
					<MenuItem value={1}>Electronics</MenuItem>
					<MenuItem value={2}>Clothing</MenuItem>
					<MenuItem value={3}>Furniture</MenuItem>
				</Select>

				<TextField
					type="text"
					placeholder="enter a phone number"
					name="phone"
					value={phone}
					onChange={handleInputChange}
				/>

				<TextField
					type="text"
					placeholder="enter a address"
					name="address"
					value={address}
					onChange={handleInputChange}
				/>

				<TextField
					type="text"
					placeholder="enter a city"
					name="city"
					value={city}
					onChange={handleInputChange}
				/>
			</FormControl>
			<Container>
				<Button
					sx={{
						m: 1,
						bgcolor: "#6096ba",
						":hover": { bgcolor: "darkblue" }
					}}
					variant="contained"
					onClick={registerUser}>Register</Button>
				<Button sx={{
					m: 1,
					bgcolor: "#6096ba",
					":hover": { bgcolor: "#d32f2f" },
				}}
				variant="contained"
				onClick={handleCancel}>
                    Cancel
				</Button>
			</Container>

		</Container >
	)
}

export default ProductNew
