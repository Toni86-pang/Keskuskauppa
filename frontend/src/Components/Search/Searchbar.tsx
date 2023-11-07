import { useState, useEffect } from "react"
import {
	TextField,
	styled,
	alpha,
	Button,
	Box
} from "@mui/material"
import { ProductType } from "../../Services-types/types"
import { fetchAllProducts } from "../../Services-types/services"
import { useNavigate, useLocation } from "react-router-dom"
import DisplayProducts from "../Product-related/DisplayProducts"

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
	const [searchProducts, setSearchProducts] = useState<ProductType[]>([])
	const [searchResults, setSearchResults] = useState<ProductType[]>([])
	const [maxResultsToShow, setMaxResultsToShow] = useState(initialMaxResultsToShow)
	const [modalOpen, setModalOpen] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()

	// close the modal if user clicks outside the search field or search results
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (!e.target) return
			if (modalOpen && !(e.target as Element).closest(".search-results") && !(e.target as Element).closest("#search-field")) {
				setModalOpen(false)
				setSearchProducts([])
			}
		}
		document.addEventListener("click", handleClick)

		return () => {
			document.removeEventListener("click", handleClick)
		}
	}, [modalOpen])

	useEffect(() => {
		setSearchQuery("")
	}, [location])

	useEffect(() => {
		const performSearch = () => {
			const matchingProducts = searchProducts.filter((product) => product.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()))
			setSearchResults(matchingProducts)
		}
		performSearch()
	}, [searchProducts, searchQuery])

	const handleOnFocus = async () => {
		if (searchProducts.length === 0) {
			const loadedProducts = await fetchAllProducts()
			setSearchProducts(loadedProducts)
		}
		setModalOpen(true)
	}

	const handleShowMore = () => {
		setMaxResultsToShow(maxResultsToShow + 3)
	}

	const handleShowAllResults = async () => {
		navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`)
		setModalOpen(false)
		setSearchQuery("")		
		await handleOnFocus()		
	}

	// goes to all results page with enter
	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleShowAllResults()
		}
	}

	return (
		<Box>
			<Search>
				<TextField id="search-field"
					label="Etsi tuotteita..."
					variant="outlined"
					value={searchQuery}
					onKeyDown={handleKeyDown}
					onFocus={handleOnFocus}
					onChange={(e) => setSearchQuery(e.target.value)}
					InputLabelProps={{ style: {color: "white" } }}
				/>
			</Search>

			{modalOpen && searchQuery && searchResults.length > 0 && (
				<Box className="search-results"
					sx={{
						position: "absolute",
						backgroundColor: "aliceblue",
						display: "flex",
						paddingRight: "2.5rem",
						top: "100%",
						left: "35%",
						zIndex: 1
					}}>
					<ul>
						<DisplayProducts productList={searchResults.slice(0, maxResultsToShow)} />
						<Box 
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							{searchResults.length > maxResultsToShow && (
								<Button
									onClick={handleShowMore}
									sx={{ marginTop: 2 }}
								>
								Näytä lisää tuloksia
								</Button>
							)}

							<Button
								onClick={handleShowAllResults}
								sx={{ marginTop: 2 }}
							>
							Näytä kaikki tulokset
							</Button>
						</Box>
					</ul>
				</Box>
			)}
		</Box>
	)
}

export default ProductSearch