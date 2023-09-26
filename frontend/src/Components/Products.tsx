import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import {
	Container,
	Typography,
	List,
	ListItem,
	ListItemText,
	Button,
} from "@mui/material"

function Products() {
	const [products, setProducts] = useState<Product[]>([])

	interface Product {
		product_id: number
		title: string
		category_id: number
		subcategory_id: number
		location: string
		description: string
		price: number
	}

	const fetchProducts = async () => {
		try {
			const response = await axios.get("/api/product")
			console.log(response.data)
			setProducts(response.data)
		} catch (error) {
			console.error("error fetching products", error)
		}
	}

	useEffect(() => {
		fetchProducts()
	}, [])

	return (
		<Container>
			<Typography variant="h3" gutterBottom>
				Kaikki tuotteet
			</Typography>
			<List>
				{products.map((product) => (
					<ListItem key={product.product_id}>
						<ListItemText
							primary={product.title}
							secondary={`Category: ${product.category_id}, Subcategory: ${product.subcategory_id}, Price: ${product.price}`}
						/>
						<Button
							component={Link}
							to={`/product/${product.product_id}`}
							variant="outlined"
						>
							View Details
						</Button>

					</ListItem>
				))}
			</List>
		</Container>
	)
}

export default Products