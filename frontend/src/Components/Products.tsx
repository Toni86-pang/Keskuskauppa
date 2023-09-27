import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
	Container,
	Typography,
	List,
	ListItem,
	ListItemText,
	Button,
} from "@mui/material"
import { ProductType } from "../types"
import { fetchAllProducts } from "../services"


function Products() {
	const [products, setProducts] = useState<ProductType[]>([])

	useEffect(() => {
		fetchAllProducts().then((data) => {
			if (data === undefined) {
				console.error("error fetching products")
				return
			}
			setProducts(data)
		})
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
