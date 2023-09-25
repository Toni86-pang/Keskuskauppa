import { useState, useEffect, useContext } from "react"
// import { useLoaderData } from "react-router-dom"
import { Grid, Breadcrumbs, Link, Typography, Button, } from "@mui/material"
import Divider from "@mui/material/Divider"
import VerifyDialog from "./VerifyDialog"
// import { useNavigate } from "react-router-dom"
import UpdateProfile from "./UpdateProfile"
import { UserTokenContext } from "../App"
import { deleteUser, fetchOwnProducts, fetchUser} from "../services"
import { ProductType, User, initialState } from "../types"
import ProductCard from "./ProductCard"
import Rating from "@mui/material/Rating"


function Profile() {
	
	const [user, setUser] = useState<User>(initialState)
	const [token] = useContext(UserTokenContext)	
	const [updateVisible, setUpdateVisible] = useState(false)
	const [ownProducts, setOwnProducts] = useState<ProductType[] | null>(null)
	const [verifyOpen, setVerifyOpen] = useState<boolean>(false)
	// const navigate = useNavigate()

	const handleVerification = () => {
		setVerifyOpen(true)
	}

	const fetchInfo = async () => {
		if(!token){
			setUser(initialState)
			setOwnProducts(null)
			return
		}

		const user = await fetchUser(token)

		if (user === undefined) {
			console.error("error fetching user")
			return
		}
		
		const products = await fetchOwnProducts(Number(user.user_id))
		
		if(products === undefined) {
			console.error("error fetching products")
			return
		}
		
		setUser(user)
		setOwnProducts(products)
	}

	useEffect(() => {
		console.log("haetaan käyttäjää token", token)
		fetchInfo()
	}, [token])

	const deleteProfile = async () => {
		deleteUser(token)
		// navigate("/")
	}

	const verifyDialogProps = {
		messageText: "Haluatko varmasti poistaa profiilisi?",
		acceptButtonText: "Poista",
		isOpen: verifyOpen,
		setOpen: setVerifyOpen,
		onAccept: deleteProfile
	}

	// interface Crumb {
	// 	label: string
	// 	url?: string
	// }

	// const breadcrumbs : Crumb[] = [
	// 	{ label: "Home", url: "/" },
	// 	{ label: "Category", url: "/category" },
	// 	{ label: "Subcategory", url: "/category/subcategory" },
	// 	{ label: "Current Page" },
	// ]

	return (

		<div className="profile">
			{/* <Crumbs items={breadcrumbs}/> */}
			<div>
				<Breadcrumbs aria-label="breadcrumb">
					<Link
						underline="hover"
						sx={{ display: "flex", alignItems: "center" }}
						color="inherit"
						href="/">
						Etusivu
					</Link>
					<Typography
						sx={{ display: "flex", alignItems: "center" }}
						color="text.primary"
					>
						Profiili
					</Typography>
				</Breadcrumbs>
			</div>
			<Grid
				container
				spacing={1}
				direction="row"
				justifyContent="center"
				alignItems="center"
			>
				<Grid item xs={4}>
					<div><img src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e" style={{
						margin: "auto",
						display: "block",
						maxWidth: "220px",
						maxHeight: "220px",
					}} /></div>

				</Grid>
				{user && <Grid item xs={5}>
					<div className="user">
						<div className="userName">Nimi: {user?.name}</div>
						<div className="userUsername">Käyttäjänimi: {user?.username}</div>
						<div className="userAddress">Osoite: {user?.address}</div>
						<div className="userCity">Kaupunki: {user?.city}</div>
						<div className="userPostalCode">Postinumero: {user?.postal_code}</div>
						<div className="userEmail">Sähköposti: {user?.email}</div>
						<div className="userPhone">Puhelinnumero: {user?.phone}</div>
						<div>Tuotteita myynnissä: {ownProducts?.length}</div>
						<div>Oma tähtiarvio:
							<Rating name="read-only" value={3.33} precision={0.1} readOnly />
						</div>
					</div>
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
						<Grid item><Button variant="contained">Vaihda salasana</Button></Grid>
						<Grid item>
							<Button variant="contained" onClick={handleVerification} >Poista profiili</Button>
							<VerifyDialog {...verifyDialogProps} />
						</Grid>
					</Grid>
				</Grid>
			</Grid>


			<div className="ownProducts">
				<div style={{ marginBottom: "10px" }}>Omat ilmoitukset:</div>

				<Divider variant="middle" style={{ marginBottom: "10px" }} />
				{ownProducts && ownProducts?.map((product: ProductType) => {
					return <ProductCard product={product} key={"own product: " + product.product_id} />
				})}
			</div>

		</div>
	)
}

export default Profile
