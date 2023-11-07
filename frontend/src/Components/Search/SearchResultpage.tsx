import { useLocation } from "react-router-dom"
import ProductCard from "../Product-cards/ProductCard"
import { searchProducts } from "../../Services-types/services"
import { fetchSubcategories } from "../../Services-types/services"
import { useEffect, useState } from "react"
import { ProductType, Subcategory } from "../../Services-types/types"
import {
	Box,
	Typography,
	List
} from "@mui/material"

const SearchResultsPage = () => {
	const location = useLocation()
	const searchQuery = new URLSearchParams(location.search).get("query")
	const [searchResults, setSearchResults] = useState<ProductType[]>([])
	const [subcategories, setSubcategories] = useState<Subcategory[]>([])

	useEffect(() => {
		const fetchSearchResults = async () => {
			try {
				if (searchQuery) {
					const products = await searchProducts(searchQuery)
					setSearchResults(products)
				} else {
					setSearchResults([])
				}
			} catch (error) {
				console.error("Error fetching search results:", error)
				setSearchResults([])
			}
		}

		const fetchCategoriesAndSubcategories = async () => {
			try {
				const subcategoriesData = await fetchSubcategories()
				setSubcategories(subcategoriesData)
			} catch (error) {
				console.error("Error fetching categories and subcategories:", error)
			}
		}

		if (searchQuery !== null) {
			fetchSearchResults()
			fetchCategoriesAndSubcategories()
		}
	}, [searchQuery])

	const getSubcategoryProductCount = (subcategory: Subcategory) => {
		return searchResults.filter(
			(product) => product.subcategory_id === subcategory.subcategory_id
		).length
	}

	return (
		<Box>
			<Typography variant="h5" sx={{ p: 2 }}>Löytyneet tuotteet</Typography>
			{subcategories.map((subcategory) => {
				const subcategoryProductCount = getSubcategoryProductCount(subcategory)
				return subcategoryProductCount > 0 ? (
					<Box sx={{ ml: 5 }} key={subcategory.subcategory_id}>
						<Typography variant="h6" 	>
							{subcategory.subcategory_name} ({subcategoryProductCount} tuotetta)
						</Typography>
						<List>
							{searchResults
								.filter(
									(product) => product.subcategory_id === subcategory.subcategory_id
								)
								.map((product) => (
									<ProductCard key={product.product_id} product={product} />
								))}
						</List>
					</Box>
				) : null
			})}
		</Box>
	)
}

export default SearchResultsPage
