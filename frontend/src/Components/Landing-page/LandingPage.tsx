import { useState, useEffect, useContext } from "react"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"
import Login from "../Register-login/Login"
import { ProductType, User } from "../../Services-types/types"
import { fetchLatestProducts, fetchUser } from "../../Services-types/services"
import { UserTokenContext } from "../../App"
import CustomCarousel from "./Carousel/Carousel"
import RegisterNewUser from "../Register-login/RegisterNewUser"
import { Typography } from "@mui/material"

const NUMBER_OF_PRODUCTS = 7

const LandingPage = () => {
	const commonBoxStyles = {
		flex: 1, 
		margin: "10px", 
		borderRadius: "10px",
		padding: "100px",
		display: "flex",
		flexDirection: "column",
		alignItems: "center", 
		justifyContent: "center", 
		boxShadow: "2px 3px 14px -3px rgba(34, 34, 34)",
		WebkitBoxShadow: "2px 3px 14px -3px rgba(34, 34, 34)",
		MozBoxShadow: "2px 3px 14px -3px rgba(34, 34, 34)",
	}
	const commonInnerBoxStyles = {
		backgroundColor: "#1976d2",
		borderRadius: "4px",
		textAlign: "center",
		alignItems: "center",
		color: "#fff",
		border: "none",
		boxShadow:
		"0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
		minWidth: "64px",
		"&:hover": {
			backgroundColor: "#1565c0",
			boxShadow:
		"0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
		},
	}
	
	
	const [token] = useContext(UserTokenContext)
	const [user, setUser] = useState<User | null>(null)
	const isLoggedIn = Boolean(user)




	useEffect(() => {
		const fetchUserDetails = async () => {
			if (!token) {
				setUser(null)
				return
			}
			const user = await fetchUser(token)

			if (!user) {
				console.error("error fetching user")
				return
			}
			setUser(user)
		}
		fetchUserDetails()
	}, [token])

	const [products, setProducts] = useState<ProductType[]>([])

	useEffect(() => {
		const loadCarouselProducts = async () => {
			const loadedCarouselProducts = await fetchLatestProducts(NUMBER_OF_PRODUCTS)
			setProducts(loadedCarouselProducts)
		}
		loadCarouselProducts()
	}, [])

	return (
		<Box>
			<Container sx={{marginBottom: "5%"}}>
				{products.length > 0 && <CustomCarousel carouselProducts={products} />}
			</Container>
			<Box
				display="flex"
				flexDirection={{ xs: "column", md: "row" }} 
				alignItems="center"
				justifyContent="center"
			>
				<Box className="custom-container-two" sx={commonBoxStyles}>
					{isLoggedIn ? (
						<Box> 
							<Typography variant="h4">Tervetuloa {user?.username}!</Typography>
						</Box>
					) : (
						<Box>
							<Typography variant="h4">Onko sinulla jo käyttäjätunnus?</Typography>
							<Box sx={commonInnerBoxStyles}>
								<Login />
							</Box>
						</Box>
					)}
				</Box>
				<Box className="custom-container-two" sx={commonBoxStyles}>
					{isLoggedIn ? (
						<Box>
							<Typography variant="h4">Selaa tuotteita</Typography>
							<Button href='/products' variant="contained" color="primary">
								Kaikki tuotteet
							</Button>
						</Box>
					) : (
						<Box>
							<Typography variant="h4">Liity joukkoomme!</Typography>
							<Box sx={commonInnerBoxStyles}>
								<RegisterNewUser />
							</Box>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	)
}

export default LandingPage
