import { useState, useEffect } from "react"
import SearchIcon from "@mui/icons-material/Search"
import axios from "axios"
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	Button,
	styled,
	InputBase,
	alpha,

} from "@mui/material"

import CategoryMenu from "./CategoryMenu"

interface Category {
	category_id: number,
	category_name: string,
	subcategory_id: number,
	subcategory_name: string

}

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(3),
		width: "auto",
	},
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
}))


const Navbar = () => {

	const [categories, setCategories] = useState<Category[]>([])
	const [subCategories, setSubCategories] = useState<{ [key: number]: Category[] }>({})

	async function fetchCategories() {
		try {
			const response = await axios.get("/api/category")
			const data = response.data as Category[]
			return data
		} catch (error) {
			console.log("Failed to fetch categories:", error)
			return []
		}
	}

	useEffect(() => {
		fetchCategories().then((data) => {
			setCategories(data)
		})
	}, [])

	async function fetchSubCategories() {
		try {
			const response = await axios.get("/api/category/subcategory")
			const data = response.data as Category[]

			const subCategoriesGrouped: { [key: number]: Category[] } = {}
			data.forEach((subCategory) => {
				const mainCategoryId = subCategory.category_id
				if (!subCategoriesGrouped[mainCategoryId]) {
					subCategoriesGrouped[mainCategoryId] = []
				}
				subCategoriesGrouped[mainCategoryId].push(subCategory)
			})

			setSubCategories(subCategoriesGrouped)
			return data
		} catch (error) {
			console.log("Debug 3 subcategories:", error)
			return []
		}
	}

	useEffect(() => {
		fetchSubCategories()
	}, [categories])

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={{ bgcolor: "#6096ba" }}>
				<Toolbar>
					<CategoryMenu categories={categories} subCategories={subCategories} />
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Keskuskauppa
					</Typography>
					<Search>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							placeholder="Haku…"
							inputProps={{ "aria-label": "search" }}
						/>
					</Search>

					<Button
						href='/register'
						color="inherit">Register</Button> <Button
						href='/login'
						color="inherit">Login</Button>
				</Toolbar>
			</AppBar>

		</Box >
	)
}
export default Navbar