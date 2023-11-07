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
	const commonButtonStyles = {		
		borderRadius: "10px",
	
		display: "flex",
		flexDirection: "column",
		alignItems: "center", 
		justifyContent: "center", 
		margin: "10px", 
		backgroundColor: "#1976d2",
		textAlign: "center",
		minHeight: 50,
		color: "#fff",
		boxShadow: "2px 3px 14px -3px rgba(34, 34, 34)",
		WebkitBoxShadow: "2px 3px 14px -3px rgba(34, 34, 34)",
		MozBoxShadow: "2px 3px 14px -3px rgba(34, 34, 34)",
		"&:hover": {
			backgroundColor: "#1565c0",
			boxShadow: "3px 4px 16px -2px rgba(34, 34, 34)",
		},
	}
	const commonInnerBoxStyles = {
		margin: "10px", 
		backgroundColor: "#1976d2",
		borderRadius: "4px",
		textAlign: "center",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		minHeight: 50,
		color: "#fff",
		boxShadow: "2px 3px 14px -3px rgba(34, 34, 34)",
		WebkitBoxShadow: "2px 3px 14px -3px rgba(34, 34, 34)",
		MozBoxShadow: "2px 3px 14px -3px rgba(34, 34, 34)",
		"&:hover": {
			backgroundColor: "#1565c0",
			boxShadow: "3px 4px 16px -2px rgba(34, 34, 34)",
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
		<Container  >
			<Box sx={{ 
				padding: "16px", 
				textAlign: "center", 	
				borderRadius: "10px",
				background: "#f3f6fa",
				boxShadow: "1px 2px 12px -2px rgba(34, 34, 34)",
				WebkitBoxShadow: "2px 3px 14px -3px rgba(34, 34, 34)",
				MozBoxShadow: "2px 3px 14px -3px rgba(34, 34, 34)",
				marginBottom:"2%"  
			}}>
				{products.length > 0 && <CustomCarousel carouselProducts={products} />}
			</Box>
			<Box sx={{ 
				padding: "16px", 
				textAlign: "center", 	
				borderRadius: "10px",
				background: "#f3f6fa",
				boxShadow: "1px 2px 12px -2px rgba(34, 34, 34)",
				WebkitBoxShadow: "2px 3px 14px -3px rgba(34, 34, 34)",
				MozBoxShadow: "2px 3px 14px -3px rgba(34, 34, 34)",  
			}} >
				<Box sx={{ padding: "16px", textAlign: "center" }}>
					{/* Heading Section */}
					<Typography variant="h4">Tervetuloa Keskuskauppaan!</Typography>
					<Typography variant="h6" sx={{ padding: "16px" }} >
          Osta ja myy tuotteita helposti ja luotettavasti.
					</Typography>
				</Box>
				<Box>
					<Box sx={{  textAlign: "center" }}>
						{/* Introduction Section */}
						<Typography variant="body1" sx={{ padding: "14px", paddingLeft:"150px", paddingRight:"150px",}}>
				Tervetuloa keskuskauppaan! Olet saapunut suomalaisen verkkokaupan keskukseen, 
				joka tarjoaa sinulle mahdollisuuden ostaa ja myydä laadukkaita tuotteita vaivattomasti.
				Keskuskauppa on paikka, jossa voit löytää monenlaisia esineitä, aarteita ja käyttötavaroita sekä tehdä kauppoja luotettavien myyjien kanssa.
				Haluamme tehdä verkkokaupasta kokemuksen, joka yhdistää ostajat ja myyjät, tarjoten samalla turvallisen ja vaivattoman alustan jokaiselle.
						</Typography>
						<Typography variant="body1" sx={{ padding: "14px" , paddingLeft:"150px", paddingRight:"150px" }}>
				Keskuskauppa on enemmän kuin vain markkinapaikka; se on yhteisö, joka arvostaa avoimuutta, luottamusta ja asiakastyytyväisyyttä. 
				Tavoitteenamme on tarjota kaikille käyttäjillemme mukava ja helppo tapa hankkia tarvitsemansa tuotteet ja myydä tarpeettomat esineet eteenpäin. 
				Kauttamme voit löytää käytettyjä huonekaluja, elektroniikkaa, vaatteita, harrastusvälineitä, ja paljon muuta.
						</Typography>
					</Box>
					<Box
						display="flex"
						flexDirection={{ xs: "column", md: "row" }} 
						alignItems="center"
						justifyContent="center"
					>
						<Box sx={{ padding: "16px", textAlign: "center" }} >
							{isLoggedIn ? (
								<Box> 
									<Typography variant="h4" sx={{ padding: "16px", textAlign: "center" }} >Tervetuloa {user?.username}! </Typography>
							
								
									<Button href='/products' variant="contained" color="primary" sx={commonButtonStyles}>
								Selaa tuotteita
									</Button>
								</Box>
							) : (
								<Box>
									<Box sx={{ padding: "16px", textAlign: "center" }}>
										<Typography variant="h5" sx={{ padding: "16px", textAlign: "center" }} >Onko sinulla jo käyttäjätunnus?</Typography>
										<Box sx={commonInnerBoxStyles} > 
											<Box > 
												<Login  /> 
											</Box> 
										</Box>
									</Box>
									<Box sx={{ padding: "16px", textAlign: "center" }}>
										<Typography variant="h5" sx={{ padding: "16px", textAlign: "center" }} >Liity joukkoomme!</Typography>
										<Box sx={commonInnerBoxStyles}>
											<RegisterNewUser />
										</Box>
									</Box>
								</Box>
							)}
						</Box>
						<Box sx={{ padding: "16px", textAlign: "center" }}>
						</Box>
					</Box>
				</Box>
			</Box>
		</Container>
	)
}

export default LandingPage
