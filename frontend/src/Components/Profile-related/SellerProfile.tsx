import { useState } from "react"
import { Button, Grid, Rating, Stack, Paper, CardMedia, Typography, Box } from "@mui/material"
import Divider from "@mui/material/Divider"
import { createTheme, ThemeProvider } from "@mui/material/styles"
//import Rating from "@mui/material/Rating"
import { useLoaderData } from "react-router-dom"
import ListReviews from "../Purchase-order-history/Order-history/ListReviews"
import { fetchStarRating, fetchUserDetailsByUserId, fetchUsersProducts } from "../../Services-types/services"
import { User, UserProducts } from "../../Services-types/types"
import DisplayProducts from "../Product-related/DisplayProducts"

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export async function loader({ params }: any) {
	const loadedUser = await fetchUserDetailsByUserId(params.id)
	console.log(loadedUser)
	const products = await fetchUsersProducts(loadedUser.user_id)
	const stars = await fetchStarRating(loadedUser.user_id)
	const userProducts: UserProducts = { loadedUser, stars, products }
	return userProducts
}

function SellerProfile() {
	const { loadedUser, stars, products } = useLoaderData() as UserProducts
	const [user] = useState<User>(loadedUser)
	const [showProducts, setShowProducts] = useState(true)

	const joinDate: string | undefined = user?.reg_day
	let formattedJoinDate: string | undefined = undefined
	if (joinDate) {
		const year: string = joinDate.substring(0, 4)
		const month: string = joinDate.substring(5, 7)
		const day: string = joinDate.substring(8, 10)
		formattedJoinDate = `${day}.${month}.${year}`
	}

	const theme = createTheme({
		components: {
			MuiButton: {
				styleOverrides: {
					textSecondary: {
						fontWeight: "bold",
					},
				},
			},
		},
		palette: {
			secondary: {
				main: "#405e8c",
			}
		}
	})

	return (
		<ThemeProvider theme={theme}>
			<Paper sx={{
				backgroundColor: "#f3f6fa",
				elevation: 5
			}}>
				<Grid container direction="column" spacing={1} justifyContent="center" alignItems="center" pt={2}>
					<Typography sx={{fontSize: "1.2rem"}}>Käyttäjän <Box  component='span' fontWeight='fontWeightBold' display='inline'>{user?.username}</Box> profiili </Typography>
				</Grid>
				<Grid
					container
					spacing={2}
					direction="row"
					justifyContent="center"
					alignItems="center"
				>
					<Grid item xs={5}>
						<CardMedia
							component="img"
							image = {user.user_image as string}
							alt="Image"
							sx={{
								display: "block",
								width: "250px",
								height: "250px",
								borderRadius: "100%",
								m: 2,
								p: 5
							}}
						/>
					</Grid>
					{user && <Grid item xs={4}>
						<Box p={3}>
							<Typography sx={{fontSize: "0.9rem"}}>Käyttäjänimi: {user?.username}</Typography>
							<Typography sx={{fontSize: "0.9rem"}}>Rekisteröitynyt: {formattedJoinDate} </Typography>
							<Typography sx={{fontSize: "0.9rem"}}>Kaupunki: {user?.city}</Typography>
							<Typography sx={{fontSize: "0.9rem"}}>Postinumero: {user?.postal_code}</Typography>
							<Typography sx={{fontSize: "0.9rem"}}>Tuotteita myynnissä: {products?.length}</Typography>
							<Typography sx={{fontSize: "0.9rem"}}>Myyjän tähtiarvio:
								<Rating name="read-only" value={stars} precision={0.1} readOnly />
							</Typography>
						</Box>
					</Grid>}
				</Grid>
				<Stack spacing={2} direction="row" justifyContent="center" alignItems="center">
					<Button onClick={() => setShowProducts(true)} variant="text" color={showProducts ? "secondary" : "primary"}>Myyjän myynnissä olevat tuotteet</Button>
					<Typography>|</Typography>
					<Button onClick={() => { setShowProducts(false)}} variant="text" color={!showProducts ? "secondary" : "primary"}>Myyjän saamat arvostelut</Button>
				</Stack>
				{showProducts ?
					<Box ml={3} mr={3}>
						<Divider variant="middle" style={{ marginBottom: "10px" }} />
						{products.length > 0 ? <DisplayProducts productList={products} /> :
							(
								<Typography>Ei tuotteita.</Typography>

							)}
					</Box> :
					<Box ml={3} mr={3}>
						<Divider variant="middle" style={{ marginBottom: "10px" }} />
						{<ListReviews sellerId={user.user_id} isOwn={false} />}
					</Box>}
			</Paper>
		</ThemeProvider>
	)
}

export default SellerProfile
