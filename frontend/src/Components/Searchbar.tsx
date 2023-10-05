import { useState } from "react"
import { Button, TextField, Typography, Popover, List, ListItem, ListItemText } from "@mui/material"
import { alpha, styled } from "@mui/material"
import { ProductType } from "../types"
import { searchProducts } from "../services"

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

const ProductSearch = () => {
	const [searchQuery, setSearchQuery] = useState("")
	const [searchResults, setSearchResults] = useState<ProductType[]>([])
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handlePopoverClose = () => {
		setAnchorEl(null)
	}

	const open = Boolean(anchorEl)

	const performSearch = async () => {
		try {
			const products = await searchProducts(searchQuery)
			setSearchResults(products)
		} catch (error) {
			console.error("Error performing search:", error)
			setSearchResults([])
		}
	}

	return (
		<div>
			<Typography variant="h5" component="div" gutterBottom>
        Product Search
			</Typography>

			<Search>
				<TextField
					label="Etsi tuotteita..."
					variant="outlined"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onFocus={handlePopoverOpen}
				/>
				<Button variant="contained" color="primary" onClick={performSearch}>
          Search
				</Button>
			</Search>

			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={handlePopoverClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left",
				}}
			>
				<List>
					{searchResults.map((product) => (
						<ListItem key={product.product_id} button>
							<ListItemText primary={product.title} />
						</ListItem>
					))}
				</List>
			</Popover>
		</div>
	)
}

export default ProductSearch
