import { useState, useEffect } from "react"
import { useLoaderData } from "react-router-dom"
import axios from "axios"
import {
	Container,
	Typography,
	List
} from "@mui/material"
import ProductCard from "./ProductCard"

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export function loader({ params }: any) {
	return params.id
}

interface Product {
  product_id: number
  title: string
  category_id: number
  subcategory_id: number;
  city: string
  postal_code: string
  description: string
  price: number
}

interface Props {
	category?: boolean
	subCategory?: boolean
  }

const Products = ({ category, subCategory }: Props) => {
	const [products, setProducts] = useState<Product[]>([])
	const [categoryHeader, setCategoryHeader] = useState("")
	const id = String(useLoaderData())

	useEffect(() => {
		const fetchData = async () => {
			let fetchedProducts: Product[] = []
			let name = "Kaikki tuotteet"
			if (!category && !subCategory) {
				fetchedProducts = await axios.get("/api/product").then(res => res.data)
			} else if (category) {
				name = await axios.get(`/api/category/categoryname/${id}`).then(res => res.data)
				fetchedProducts = await axios.get(`/api/product/category/${id}`).then(res => res.data)
			} else {
				name = await axios.get(`/api/category/subcategoryname/${id}`).then(res => res.data)
				fetchedProducts = await axios.get(`/api/product/subcategory/${id}`).then(res => res.data)
			}
			setProducts(fetchedProducts)

			if (id) {
				setCategoryHeader(name)
			}
		}

		fetchData()
	}, [id, category, subCategory])

	return (
		<Container>
			<Typography variant="h3" gutterBottom>
				{categoryHeader}
			</Typography>
			<List>
				{products.map((product, index) => (
					<ProductCard key={"products " + index} product={product} />
				))}
			</List>
		</Container>
	)
}

export default Products