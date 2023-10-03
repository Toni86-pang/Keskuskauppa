import { useState, useEffect } from "react"
import SearchIcon from "@mui/icons-material/Search"
import { Button, TextField, Typography } from "@mui/material"
import { alpha, styled } from "@mui/material" 
import { ProductType } from "../types"
import { searchProducts } from "../services"
// Import styled

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

const ProductSearch = () => {
	const [searchQuery, setSearchQuery] = useState("")
	const [searchResults, setSearchResults] = useState<ProductType[]>([])
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const performSearch = async () => {
			try {
				const products = await searchProducts(searchQuery)
				setSearchResults(products)
				setError(null)
			} catch (error) {
				console.error("Error performing search:", error)
				setError("An error occurred while searching.")
				setSearchResults([])
			}
		}

		if (searchQuery) {
			performSearch()
		} else {
			// Clear search results when the query is empty
			setSearchResults([])
			setError(null)
		}
	}, [searchQuery])

	return (
		<div>
			<Typography variant="h5" component="div" gutterBottom>
        Product Search
			</Typography>

			<Search>
				<SearchIconWrapper>
					<SearchIcon />
				</SearchIconWrapper>
				<TextField
					label="Etsi tuotteita..."
					variant="outlined"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<Button variant="contained" color="primary">
          Search
				</Button>
			</Search>

			{error && (
				<Typography variant="body2" color="error" gutterBottom>
					{error}
				</Typography>
			)}
			<ul>
				{searchResults.map((product) => (
					<li key={product.product_id}>{product.title}</li>
				))}
			</ul>
		</div>
	)
}

export default ProductSearch
