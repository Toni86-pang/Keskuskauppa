import React, { useState, useEffect } from "react"
import { Button, IconButton, Menu, MenuItem } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import axios from "axios"

interface Category {
	category_id: number
	category_name: string
	subcategory_id: number
	subcategory_name: string
}

const CategoryMenu = () => {

	// anchor element for main category dropdown
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)

	const [categories, setCategories] = useState<Category[]>([])
	const [subCategories, setSubCategories] = useState<{ [key: number]: Category[] }>({})

	// anchor element array for submenus 
	const [submenuAnchorEls, setSubmenuAnchorEls] = useState<(null | HTMLElement)[]>(new Array(categories.length).fill(null))
	const [openedSubMenuIndex, setOpenedSubMenuIndex] = useState<number | null>(null)

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

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleMenuClose = () => {
		setAnchorEl(null)
		setOpenedSubMenuIndex(null)
	}

	// sets all anchor elements to null and then current one to element received by mouse click event.
	// sets the index for the open property for current submenu
	const handleSubMenuOpen = (event: React.MouseEvent<HTMLElement>, index: number) => {
		const updatedAnchors = new Array(categories.length).fill(null)
		updatedAnchors[index] = event.currentTarget
		setSubmenuAnchorEls(updatedAnchors)
		setOpenedSubMenuIndex(index)
	}

	const handleSubMenuClose = () => {
		const updatedAnchors = new Array(categories.length).fill(null)
		setSubmenuAnchorEls(updatedAnchors)
		setOpenedSubMenuIndex(null)
	}

	return (
		<>
			<IconButton onClick={handleMenuOpen} size="large" edge="start" color="inherit" aria-label="menu">
				<MenuIcon />
			</IconButton>

			<Menu
				anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
				<MenuItem>
					<Button href="/">Etusivu</Button>
				</MenuItem>
				{categories.map((category, index) => (
					<div key={"category " + index.toString()}>
						<MenuItem onClick={(e) => handleSubMenuOpen(e, index)}>
							<Button href={`/product/${category.category_id}`} sx={{ "&:hover": { textDecoration: "underline" } }} >{category.category_name}</Button>
							<ArrowDropDownIcon sx={{ transform: "rotate(-90deg)", marginLeft: "auto" }} />
						</MenuItem>

						{/* SubMenus */}
						<Menu
							anchorEl={submenuAnchorEls[index]}
							open={openedSubMenuIndex === index}
							onClose={handleSubMenuClose}
							anchorOrigin={{ vertical: "top", horizontal: "right" }}
							transformOrigin={{ vertical: "top", horizontal: "left" }}
						>
							{subCategories[1] && subCategories[category.category_id].map((subCategory, subMenuIndex) => (
								<MenuItem key={"subcategory " + subMenuIndex.toString()} onClick={handleMenuClose}>
									<Button href={`/product/${subCategory.subcategory_id}`} sx={{ "&:hover": { textDecoration: "underline" } }} >{subCategory.subcategory_name}</Button>
								</MenuItem>
							))}
						</Menu>
					</div>
				))}
			</Menu>
		</>
	)
}

export default CategoryMenu