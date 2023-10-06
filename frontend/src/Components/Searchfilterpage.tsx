import { useLocation } from "react-router-dom"
import ProductCard from "./ProductCard"
import { searchProducts } from "../services"
import { fetchCategories, fetchSubcategories } from "../services"
import { useEffect, useState } from "react"
import { ProductType, Category, Subcategory } from "../types"

const SearchResultsPage = () => {
	const location = useLocation()
	const searchQuery = new URLSearchParams(location.search).get("query")
	const [searchResults, setSearchResults] = useState<ProductType[]>([])
	const [categories, setCategories] = useState<Category[]>([])
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
				const categoriesData = await fetchCategories()
				const subcategoriesData = await fetchSubcategories()
				setCategories(categoriesData)
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

	const getCategoryProductCount = (category: Category) => {
		return searchResults.filter(
			(product) => product.category_id === category.category_id
		).length
	}

	const getSubcategoryProductCount = (subcategory: Subcategory) => {
		return searchResults.filter(
			(product) => product.subcategory_id === subcategory.subcategory_id
		).length
	}

	return (
		<div>
			<h2>Search Results</h2>
			{categories.map((category) => {
				const categoryProductCount = getCategoryProductCount(category)
				return categoryProductCount > 0 ? (
					<div key={category.category_id}>
						<h3>
							{category.category_name} ({categoryProductCount} Tuotetta)
						</h3>
						<ul>
							{searchResults
								.filter(
									(product) => product.category_id === category.category_id
								)
								.map((product) => (
									<ProductCard key={product.product_id} product={product} />
								))}
						</ul>
					</div>
				) : null
			})}

			{subcategories.map((subcategory) => {
				const subcategoryProductCount = getSubcategoryProductCount(subcategory)
				return subcategoryProductCount > 0 ? (
					<div key={subcategory.subcategory_id}>
						<h3>
							{subcategory.subcategory_name} ({subcategoryProductCount} Tuotetta)
						</h3>
						<ul>
							{searchResults
								.filter(
									(product) => product.subcategory_id === subcategory.subcategory_id
								)
								.map((product) => (
									<ProductCard key={product.product_id} product={product} />
								))}
						</ul>
					</div>
				) : null
			})}
		</div>
	)
}

export default SearchResultsPage
