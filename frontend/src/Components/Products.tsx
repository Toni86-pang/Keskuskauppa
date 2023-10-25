import { useLoaderData } from "react-router-dom"
import {
	Container,
	Typography
} from "@mui/material"
import { fetchAllProducts, fetchCategoryName, fetchProductsByCategory, fetchProductsBySubcategory, fetchSubcategoryName} from "../services"
import { CategoryProducts, ProductType } from "../types"
import DisplayProducts from "./DisplayProducts"

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export async function loader({ request, params }: any) {
	const url = request.url.split("/").slice(-2)
	let products: ProductType[]
	let categoryHeader: string
	let categoryProducts: CategoryProducts

	if (url[0] === "category") {
		products = await fetchProductsByCategory(Number(params.id))
		if(products.length === 0) {
			categoryHeader = await fetchCategoryName(Number(params.id))
		} else {
			categoryHeader = products[0].category_name??"Kaikki tuotteet"
		}
		
		categoryProducts = { categoryHeader, products }
	} else if (url[0] === "subcategory") {
		products = await fetchProductsBySubcategory(Number(params.id))
		if(products.length === 0) {
			categoryHeader = await fetchSubcategoryName(Number(params.id))
		} else {
			categoryHeader = products[0].subcategory_name??"Kaikki tuotteet"
		}		
		categoryProducts = { categoryHeader, products }
	} else {
		products = await fetchAllProducts()
		categoryHeader = "Kaikki tuotteet"
		categoryProducts = { categoryHeader, products }
	}

	return categoryProducts
}

const Products = () => {
	const categoryProducts = useLoaderData() as CategoryProducts
	const { products, categoryHeader } = categoryProducts

	return (

		<Container>
			<Typography variant="h3" gutterBottom>
				{categoryHeader}
			</Typography>
			<DisplayProducts productList={products} />
		</Container>
	)
}

export default Products