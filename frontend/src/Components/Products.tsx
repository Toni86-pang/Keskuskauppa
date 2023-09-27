import { useState, useEffect } from "react"
import { useLoaderData } from "react-router-dom"
import {
	Container,
	Typography,
	List
} from "@mui/material"
import ProductCard from "./ProductCard"
import { fetchAllProducts, fetchCategoryName, fetchProductsByCategory, fetchProductsBySubcategory, fetchSubcategoryName } from "../services"

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
		const fetchProducts = async () => {
			let fetchedProducts: Product[] = []
			let name = "Kaikki tuotteet"
			if (!category && !subCategory) {
				fetchedProducts = await fetchAllProducts() 
			} else if (category) {
				name = await fetchCategoryName(Number(id))
				fetchedProducts = await fetchProductsByCategory(Number(id))
			} else {
				name = await fetchSubcategoryName(Number(id))
				fetchedProducts = await fetchProductsBySubcategory(Number(id))
			}
			setProducts(fetchedProducts)

			if (id) {
				setCategoryHeader(name)
			}
		}

		fetchProducts()
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