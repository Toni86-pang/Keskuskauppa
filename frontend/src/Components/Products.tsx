import { useState, useEffect } from "react"
// import { Link } from "react-router-dom"
import { useLoaderData } from "react-router-dom"
import {
	Container,
	Typography
} from "@mui/material"
import { fetchAllProducts, fetchCategoryName, fetchProductsByCategory, fetchProductsBySubcategory, fetchSubcategoryName } from "../services"
import { CategoryProps, ProductType } from "../types"
import DisplayProducts from "./DisplayProducts"

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export function loader({ params }: any) {
	return params.id
}

const Products = ({ category, subCategory }: CategoryProps) => {
	const [products, setProducts] = useState<ProductType[]>([])
	const [categoryHeader, setCategoryHeader] = useState("")
	const id = String(useLoaderData())

	useEffect(() => {
		const fetchProducts = async () => {
			let fetchedProducts: ProductType[] = []
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
			<DisplayProducts productList={products}/>
		</Container>
	)
}

export default Products