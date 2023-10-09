import { useState, useEffect } from "react"
import {
	TextField,
	Typography,
	styled,
	alpha,
	Button,
} from "@mui/material"
import "./Searchbar.css"
import { ProductType } from "../types"
import { searchProducts } from "../services"
import ProductCard from "./ProductCard"
import { useNavigate, useLocation } from "react-router-dom"

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
		width: "auto",
	},
}))

const initialMaxResultsToShow = 3

const ProductSearch = () => {
	const [searchQuery, setSearchQuery] = useState("")
	const [searchResults, setSearchResults] = useState<ProductType[]>([])
	const [error, setError] = useState<string | null>(null)
	const [maxResultsToShow, setMaxResultsToShow] = useState(initialMaxResultsToShow)
	const [modalOpen, setModalOpen] = useState(false) 
	const navigate = useNavigate()
	const location = useLocation()

	useEffect(() => {
		const performSearch = async () => {
			try {
				const products = await searchProducts(searchQuery)
				setSearchResults(products)
				setError(null)
				setModalOpen(true) 
			} catch (error) {
				console.error("Error performing search:", error)
				setError("An error occurred while searching.")
				setSearchResults([])
				setModalOpen(false) 
			}
		}

		if (searchQuery) {
			performSearch()
		} else {
			setSearchResults([])
			setError(null)
			setModalOpen(false)
		}
	}, [searchQuery])

	const handleShowMore = () => {
		setMaxResultsToShow(maxResultsToShow + 3)
	}

	const handleShowAllResults = () => {
		setModalOpen(false)
		navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`)
	}


	useEffect(() => {
		if (location.pathname.startsWith("/product/") || location.pathname.startsWith("/search-results")) {
			setSearchQuery("") 
		}
	}, [location.pathname])

	return (
		<div>

			<Search>
				<TextField
					label="Etsi tuotteita..."
					variant="outlined"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</Search>

			{error && (
				<Typography variant="body2" color="error" gutterBottom>
					{error}
				</Typography>
			)}

			{modalOpen && searchQuery && searchResults.length > 0 && (
				<div className="search-results">
					<ul>
						{searchResults.slice(0, maxResultsToShow).map((product) => (
							<ProductCard 
								key={product.product_id} 
								product={product} 
							/>
						))}

						{searchResults.length > maxResultsToShow && (
							<Button
								onClick={handleShowMore}
								variant="outlined"
								color="primary"
								sx={{ marginTop: 2 }}
							>
                Näytä lisää tuloksia
							</Button>
						)}

						<Button
							onClick={handleShowAllResults}
							variant="outlined"
							color="primary"
							sx={{ marginTop: 2 }}
						>
              Näytä kaikki tulokset
						</Button>
					</ul>
				</div>
			)}
		</div>
	)
}

export default ProductSearch