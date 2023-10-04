import { Breadcrumbs, Link, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useLocation, Link as RouterLink } from "react-router-dom"
import { fetchProduct, fetchCategoryName, fetchSubcategoryName, fetchSubcategories } from "../services"
import { ProductType } from "../types"
import { BreadcrumbResolver } from "../types"

const categoryMapper = async () => {
	const categoryList = await fetchSubcategories()
	type categoryMapType = {
		[key: string]: [string, number]
	}	
	const categoryMap: categoryMapType = {}
	
	categoryList.map((subcategory) => categoryMap[subcategory.subcategory_id] = [subcategory.subcategory_name, subcategory.category_id])
	return categoryMap
}

const breadcrumbMap: Record<string, string[] | BreadcrumbResolver> = {
	"/": [],
	"/products": ["Kaikki tuotteet"],
	"/product/new": ["Uusi tuote"],
	"/profile": ["Profiili"],
	"/product/:id": async (id) => {
		const product: ProductType = await fetchProduct(Number(id))
		const category = await fetchCategoryName(product.category_id)
		const subcategory = await fetchSubcategoryName(product.subcategory_id)
		return [category, subcategory, product.title]
	},
	"/products/category/:id": async (id) => {
		const categoryName = await fetchCategoryName(Number(id))
		return [categoryName]
	},
	"/products/subcategory/:id": async (id) => {
		const categoryMap = await categoryMapper()
		const subcategoryName = await fetchSubcategoryName(Number(id))
		const categoryName = await fetchCategoryName(categoryMap[id][1])
		return [categoryName, subcategoryName]
	}
}

export default function Crumbs() {
	const location = useLocation()
	const [breadcrumbs, setBreadcrumbs] = useState<string[]>([])

	useEffect(() => {
		const generateBreadcrumbs = async () => {
			const routes = location.pathname.split("/")
			// if pathname ends with a number, replace it with ":id" using regex
			const routePattern = location.pathname.replace(/\/(\d+)$/, "/:id")
			const breadcrumbData = breadcrumbMap[routePattern]
			let crumbs: string[] = []
			if (typeof breadcrumbData === "function") {
				const param = routes[routes.length-1]
				crumbs = await breadcrumbData(param)
			} else {
				crumbs = breadcrumbData
			}
			setBreadcrumbs(crumbs)
		}

		generateBreadcrumbs()
	}, [location])

	return (
		<Breadcrumbs>
			<Link color="inherit" component={RouterLink} to="/">
                Etusivu
			</Link>
			{breadcrumbs.map((label, index) => {
				const last = index === breadcrumbs.length - 1

				return last ? (
					<Typography color="textPrimary" key={"crumb: " + index}>
						{label}
					</Typography>
				) : (
					<Link color="inherit" key={"crumblink: " + label}>
						{label}
					</Link>
				)
			})}
		</Breadcrumbs>
	)
}
