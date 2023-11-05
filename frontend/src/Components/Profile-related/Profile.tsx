import { useState, useContext } from "react"
import { Grid, Button, Stack, CardMedia, Typography, Box, Paper } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Divider from "@mui/material/Divider"
import { useNavigate, redirect, useLoaderData } from "react-router-dom"
import UpdateProfile from "./UpdateProfile"
import { UserTokenContext } from "../../App"
import Rating from "@mui/material/Rating"
import { User, UserProducts } from "../../Services-types/types"
import { deleteUser, fetchStarRating, fetchUser, fetchUsersProducts } from "../../Services-types/services"
import Notification from "../Verify-notification/Notification"
import VerifyDialog from "../Verify-notification/VerifyDialog"
import DisplayProducts from "../Product-related/DisplayProducts"
import ListReviews from "../Purchase-order-history/Order-history/ListReviews"
import ChangePassword from "../Register-login/ChangePassword"
import { useNewSaleAndReviewContext } from "../../NewSaleAndReviewContext"

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
	const token = localStorage.getItem("token")
	let userProducts: UserProducts
	if (token) {
		const loadedUser = await fetchUser(token)
		const products = await fetchUsersProducts(loadedUser.user_id)
		const stars = await fetchStarRating(loadedUser.user_id)
		userProducts = { loadedUser, stars, products }
		return userProducts
	} else {
		return redirect("/")
	}
}

function Profile() {
	const { loadedUser, stars, products } = useLoaderData() as UserProducts
	const [user, setUser] = useState<User>(loadedUser)
	const [token, setToken] = useContext(UserTokenContext)
	const { setReviewCount} = useNewSaleAndReviewContext()
	const [changePasswordVisible, setChangePasswordVisible] = useState(false)
	const [updateVisible, setUpdateVisible] = useState(false)
	const [verifyOpen, setVerifyOpen] = useState<boolean>(false)
	const navigate = useNavigate()

	const [showSuccessDeleteNotification, setShowSuccessDeleteNotification] = useState(false)
	const [showErrorDeleteNotification, setShowErrorDeleteNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)
	const [showProducts, setShowProducts] = useState(true)

	const joinDate: string | undefined = user?.reg_day
	let formattedJoinDate: string | undefined = undefined
	if (joinDate) {
		const year: string = joinDate.substring(0, 4)
		const month: string = joinDate.substring(5, 7)
		const day: string = joinDate.substring(8, 10)
		formattedJoinDate = `${day}.${month}.${year}`
	}

	const handleVerification = () => {
		setVerifyOpen(true)
	}

	const deleteProfile = async () => {
		try {
			await deleteUser(token)
			setShowSuccessDeleteNotification(true)
			handleLogout()
		} catch (error) {
			setShowErrorDeleteNotification(true)
		}
	}

	const handleLogout = () => {
		localStorage.removeItem("token")
		setToken("")
		console.log("logged out")
		setTimeout(() => {
			navigate("/")
		}, 2000)
	}

	const verifyDialogProps = {
		messageText: "Haluatko varmasti poistaa profiilisi pysyvästi?",
		acceptButtonText: "Poista",
		isOpen: verifyOpen,
		setOpen: setVerifyOpen,
		onAccept: deleteProfile
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
					<Typography sx={{fontSize: "1.2rem"}}>Oma profiili </Typography>
				</Grid>
				<Grid
					container
					spacing={2}
					direction="row"
					justifyContent="center"
					alignItems="center"
				>
					<Grid item xs={4.5}>
						<CardMedia
							component="img"
							image = {user.user_image as string}
							alt="User avatar"
							sx={{
								display: "block",
								maxWidth: "250px",
								maxHeight: "250px",
								borderRadius: "100%",
								m: 2,
								p: 3
							}}
						/>
					</Grid>
				</Grid>
				<Grid container direction="row" spacing={2} justifyContent="center" alignItems="center" pb={2}>
					{user && <Grid item xs={5}>
						<Box p={3}>
							<Typography sx={{fontSize: "0.9rem"}}>Nimi: {user?.name}</Typography>
							<Typography sx={{fontSize: "0.9rem"}}>Käyttäjänimi: {user?.username}</Typography>
							<Typography sx={{fontSize: "0.9rem"}}>Sähköposti: {user?.email}</Typography>
							<Typography sx={{fontSize: "0.9rem"}}>Puhelinnumero: {user?.phone}</Typography>
							<Typography sx={{fontSize: "0.9rem"}}>Osoite: {user?.address}</Typography>
							<Typography sx={{fontSize: "0.9rem"}}>Kaupunki: {user?.city}</Typography>
							<Typography sx={{fontSize: "0.9rem"}}>Postinumero: {user?.postal_code}</Typography>
							<Typography sx={{fontSize: "0.9rem"}}>Rekisteröitynyt: {formattedJoinDate} </Typography>
							<Typography sx={{fontSize: "0.9rem"}}>Tuotteita myynnissä: {products?.length}</Typography>
							<Typography sx={{fontSize: "0.9rem"}}>Oma tähtiarvio:
								<Rating name="read-only" value={stars} precision={0.1} readOnly />
							</Typography>
						</Box>
					</Grid>}
					<Grid item xs={3}>
						<Grid item pb={1}>
							<Button variant="contained" onClick={() => setUpdateVisible(true)}>Muokkaa</Button>

							{user && <UpdateProfile // make sure user is fetched before using component 
								isOpen={updateVisible}
								close={(updatedUser: User) => {
								// update profile page with new info when modal is closed
									setUser(updatedUser)
									setUpdateVisible(false)
								}}
								user={user}
							/>}
						</Grid>
						<Grid item>
							<Button variant="contained" onClick={() => setChangePasswordVisible(true)}>Vaihda salasana</Button>
							<ChangePassword username={user.username} open={changePasswordVisible} onClose={() => setChangePasswordVisible(false)} />
						</Grid>
						<Grid item pb={1}>
							<Button variant="contained" color={"error"} onClick={handleVerification} >Poista profiili</Button>
							<VerifyDialog {...verifyDialogProps} />
						</Grid>
						{/* Delete success and error notifications */}
						{showSuccessDeleteNotification && (
							<Notification
								open={showSuccessDeleteNotification}
								message="Käyttäjä on poistettu onnistuneesti!"
								type="success"
								onClose={() => setShowSuccessDeleteNotification(false)}
								duration={1500}
							/>
						)}
						{showErrorDeleteNotification && (
							<Notification
								open={showErrorDeleteNotification}
								message="Tapahtui virhe."
								type="error"
								onClose={() => setShowErrorDeleteNotification(false)}
								duration={1500}
							/>
						)}
						{showErrorNotification && (
							<Notification
								open={showErrorNotification}
								message="Kirjaudu sisään nähdäksesi profiilin tiedot."
								type="error"
								onClose={() => setShowErrorNotification(false)}
								duration={5000}
							/>
						)}
					</Grid>
				</Grid>
				<Stack spacing={2} direction="row" justifyContent="center" alignItems="center">
					<Button onClick={() => setShowProducts(true)} variant="text" color={showProducts ? "secondary" : "primary"}>Myynnissä olevat tuotteesi</Button>
					<Typography>|</Typography>
					<Button onClick={() => { setShowProducts(false); setReviewCount(0)}} variant="text" color={!showProducts ? "secondary" : "primary"}>Saamasi arvostelut</Button>
				</Stack>

				{showProducts ?
					<Box ml={3} mr={3}>
						<Divider variant="middle" style={{ marginBottom: "10px" }} />
						{products.length > 0 ? <DisplayProducts productList={products} /> :
							(
								<Typography>Ei omia tuotteita. Kun lisäät tuotteen myyntiin, näet sen täällä.</Typography>
							)}
					</Box> :
					<Box ml={3} mr={3}>
						<Divider variant="middle" style={{ marginBottom: "10px" }} />
						{<ListReviews sellerId={user.user_id} isOwn={true} />}
					</Box>}
			</Paper>
		</ThemeProvider>
	)
}

export default Profile