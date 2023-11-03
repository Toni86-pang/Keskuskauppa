import { Breadcrumbs, Typography, Button } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { useEffect, useState } from "react"
import { useLocation, Link as RouterLink } from "react-router-dom"
import { fetchProduct, fetchCategoryName, fetchSubcategoryName, fetchSubcategories } from "../../Services-types/services"
import { ProductType } from "../../Services-types/types"
import { BreadcrumbResolver, categoryMapType } from "../../Services-types/types"

// maps the subcategory id's into an object with subcategoryId: [subcategoryName, categoryId]
const categoryMapper = async () => {
	const categoryList = await fetchSubcategories()

	const categoryMap: categoryMapType = {}
	
	categoryList.forEach((subcategory) => {
		categoryMap[subcategory.subcategory_id] = [subcategory.subcategory_name, subcategory.category_id]
	})
	return categoryMap
}

// NOTE! This is not a function. It's an object.
// for each route there is a key that is the routePattern as it is written in main.tsx
// the value for the key is either an array of breadcrumb label and breadcrumb link address pairs for routes without id parameter or
// a function that returns an array of breadcrumb label and link address pairs 
const breadcrumbMap: Record<string, [string, string][] | BreadcrumbResolver> = {
	"/": [],
	"/products": [["Kaikki tuotteet", "/products"]],
	"/product/new": [["Uusi tuote", "/products/new"]],
	"/profile": [["Profiili", "/profile"]],
	"/checkout": [["Vastaanottajan tiedot", "/checkout"]],
	"/orderhistory": [["Tilaushistoria", "/orderhistory"]],
	"/user/:id": [["Myyjän profiili", ""]],
	"/search-results":[["Hakutulokset",""]],
	"/product/:id": async (id) => {
		const product: ProductType = await fetchProduct(Number(id))
		const category = await fetchCategoryName(product.category_id)
		const subcategory = await fetchSubcategoryName(product.subcategory_id)
		return [[category, "/products/category/" + product.category_id], [subcategory, "/products/subcategory/" + product.subcategory_id], [product.title, ""]]
	},
	"/products/category/:id": async (id) => {
		const categoryName = await fetchCategoryName(Number(id))
		return [[categoryName, "/products/category" + id]]
	},
	"/products/subcategory/:id": async (id) => {
		const categoryMap = await categoryMapper()
		const subcategoryName = await fetchSubcategoryName(Number(id))
		const categoryName = await fetchCategoryName(categoryMap[id][1])
		return [[categoryName, "/products/category/" + categoryMap[id][1]],[subcategoryName, ""]]
	}
}

export default function Crumbs() {
	const location = useLocation()
	const [breadcrumbs, setBreadcrumbs] = useState<[string, string][]>([])

	useEffect(() => {
		const generateBreadcrumbs = async () => {

			// Gets the current page path and splits it into an array at every "/" for example "/product/74" becomes ['', 'product', '74']
			const pathArray = location.pathname.split("/")

			// If pathname ends with a number, replace it with ":id" using regex so that it matches routePattern (path) in main.tsx. "/product/74" becomes "/product/:id"
			const routePattern = location.pathname.replace(/\/(\d+)$/, "/:id")

			// Gets the breadcrumbData for the current route (value of the breadcrumbMap object for the current routePattern )
			let breadcrumbData
			if(breadcrumbMap[routePattern]) {
				breadcrumbData = breadcrumbMap[routePattern]
			} else {
				breadcrumbData = [["Default Breadcrumb", ""] ] as [string, string][]
			}			

			let crumbs: [string, string][] = []

			// Paths with id's need dynamic resolving i.e., a function in the breadcrumbMap object.
			if (typeof breadcrumbData === "function") {
				// Grabs the id number from the end of the path 
				const param = pathArray[pathArray.length-1]

				// Resolves the breadcrumbs using the function
				crumbs = await breadcrumbData(param)

			} else {
				// Paths without id don't need resolving so just use the array in the breadcrumbMap
				crumbs = breadcrumbData				
			}
			setBreadcrumbs(crumbs)
		}
		generateBreadcrumbs()
	}, [location])

	const theme = createTheme({
		palette: {
			secondary: {
				main: "#405e8c",
			}
		}
	})

	return (
		<ThemeProvider theme={theme}>
			<Breadcrumbs>
				<Button color="primary" component={RouterLink} to="/">
                Etusivu
				</Button>
				{breadcrumbs.map((crumb, index) => {
					const last = index === breadcrumbs.length - 1

					return last ? (
						<Typography color="secondary" key={"crumb: " + index}>
							{crumb[0]}
						</Typography>
					) : (
						<Button color="primary" key={"crumblink: " + crumb[1]} component={RouterLink} to={crumb[1]}>
							{crumb[0]}
						</Button>
					)
				})}
			</Breadcrumbs>
		</ThemeProvider>
	)
}
