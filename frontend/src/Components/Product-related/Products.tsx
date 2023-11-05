import { useLoaderData } from "react-router-dom"
import { Typography, Paper } from "@mui/material"
import { fetchAllProducts, fetchCategoryName, fetchProductsByCategory, fetchProductsBySubcategory, fetchSubcategoryName} from "../../Services-types/services"
import { CategoryProducts, ProductType } from "../../Services-types/types"
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
		<Paper sx={{
			backgroundColor: "#f3f6fa",
			elevation: 5,
			p: 3
		}}>
			<Typography variant="h4">
				{categoryHeader}
			</Typography>
			<DisplayProducts productList={products} />
		</Paper>
	)
}

export default Products