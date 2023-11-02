import { useState, useContext } from "react"
import { Grid, Button, Stack, CardMedia, Typography, Box} from "@mui/material"
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

	return (
		<div className="profile">
			<Grid
				container
				spacing={1}
				direction="row"
				justifyContent="center"
				alignItems="center"
			>
				<Grid item xs={4}>
					<CardMedia
						component="img"
						image = {user.user_image as string}
						alt="Image"
						sx={{
							margin: "auto",
							display: "block",
							maxWidth: "270px",
							maxHeight: "270px",
						}}
					/>


				</Grid>
				{user && <Grid item xs={5}>
					<Box>
						<Typography sx={{fontSize: "0.9rem"}}> Liittymispäivä: {formattedJoinDate} </Typography>
						<Typography>Nimi: {user?.name}</Typography>
						<Typography>Käyttäjänimi: {user?.username}</Typography>
						<Typography>Osoite: {user?.address}</Typography>
						<Typography>Kaupunki: {user?.city}</Typography>
						<Typography>Postinumero: {user?.postal_code}</Typography>
						<Typography>Sähköposti: {user?.email}</Typography>
						<Typography>Puhelinnumero: {user?.phone}</Typography>
						<Typography>Tuotteita myynnissä: {products?.length}</Typography>
						<Typography>Oma tähtiarvio:
							<Rating name="read-only" value={stars} precision={0.1} readOnly />
						</Typography>
					</Box>
				</Grid>}
				<Grid item xs={3}>
					<Grid container direction="column" spacing={2}>
						<Grid item>
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
						<Grid item>
							<Button variant="contained" onClick={handleVerification} >Poista profiili</Button>
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
			</Grid>
			<Stack spacing={2} direction="row">
				<Button onClick={() => setShowProducts(true)} variant="text" color={showProducts ? "secondary" : "primary"}>Omat ilmoitukset</Button>
				<div style={{ marginTop: "9px" }}>|</div>
				<Button onClick={() => setShowProducts(false)} variant="text" color={!showProducts ? "secondary" : "primary"}>Omat arvostelut</Button>
			</Stack>

			{showProducts ?
				<div className="ownProducts">
					<Divider variant="middle" style={{ marginBottom: "10px" }} />
					{products.length > 0 ? <DisplayProducts productList={products} /> :
						(
							<Typography>Ei omia tuotteita. Kun lisäät tuotteen myyntiin, näet sen täällä.</Typography>
						)}
				</div> :
				<div className="ownReviews">
					<Divider variant="middle" style={{ marginBottom: "10px" }} />
					{<ListReviews sellerId={user.user_id} isOwn={true} />}
				</div>}
		</div>
	)
}

export default Profile