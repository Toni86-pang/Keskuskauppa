import { useState, useEffect, useContext } from "react"
// import { useLoaderData } from "react-router-dom"
import { Grid, Breadcrumbs, Link, Typography, Button, } from "@mui/material"
import StarBorderPurpleSharpIcon from "@mui/icons-material/StarBorderPurple500Sharp"
import StarPurpleSharpIcon from "@mui/icons-material/StarPurple500Sharp"
import VerifyDialog from "./VerifyDialog"
import { useNavigate } from "react-router-dom"
import UpdateProfile from "./UpdateProfile"
import { UserDataContext, UserIDContext } from "../App"
import { deleteUser, fetchOwnProducts, fetchUser, getLocalStorageItem } from "../services"
import { User } from "./Login"

//const DEBUG = true
// const DEBUGTOKEN2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pcyIsImlkIjo2MSwiaWF0IjoxNjk0MDg1NzczfQ.ihny-nTyCnl0hHNYjQDFjR2BXx8TOwGJCLdCA1imYOQ"

// interface User {
// 	userId: number
// 	username: string
// 	name: string
// 	email: string
// 	phone: string
// 	address: string
// 	city: string
// 	postal_code: string
// }

interface Product {
	product_id: number
	user_id: number
	title: string
	category_id: number
	subcategory_id: number
	location: string
	description: string
	price: number
	// product_image?: any
}

const userToken = (getLocalStorageItem("token"))
console.log(userToken)

const useUserData = (): UserDataContext => useContext(UserIDContext)

function Profile() {
	
	// const [user, setUser] = useState<User | null>(null)
	const [token] = useState<string>(userToken)
	const [updateVisible, setUpdateVisible] = useState(false)
	const [ownProducts, setOwnProducts] = useState<Product[] | null>(null)
	const [verifyOpen, setVerifyOpen] = useState<boolean>(false)
	const navigate = useNavigate()
	const userData = useUserData()

	const id = userData.user.id
	console.log("this is userid", id)
	// const id = 61

	const handleVerification = () => {
		setVerifyOpen(true)
	}

	useEffect(() => {
		const fetchUsers = () => {
			if(token !== undefined){
				fetchUser(token).then(
					user => {
						if (user !== undefined) {
							console.log("jippijei!")
							userData.setUser(user)
						} else {
							console.error("error fetching user")
						}
					}
				)}
		}
		fetchUsers()
	}, [token])

	useEffect(() => {
		fetchOwnProducts(id).then(
			products => {
				if(products !== undefined) {
					setOwnProducts(products)
				} else {
					console.error("error fetching products")
				}
			}
		)
	},[id])

	
	const deleteProfile = async () => {
		deleteUser(token)
		navigate("/")
	}

	const verifyDialogProps = {
		messageText: "Haluatko varmasti poistaa profiilisi?",
		acceptButtonText: "Poista",
		isOpen: verifyOpen,
		setOpen: setVerifyOpen,
		onAccept: deleteProfile
	}

	return (
		<div className="profile">
			<div>
				<Breadcrumbs aria-label="breadcrumb">
					<Link
						underline="hover"
						sx={{ display: "flex", alignItems: "center" }}
						color="inherit"
						href="/"
					>
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
				{userData.user.phone && <Grid item xs={5}>
					<div className="user">
						<div className="userName">Nimi: {userData.user.name}</div>
						<div className="userUsername">Käyttäjänimi: {userData.user.username}</div>
						<div className="userAddress">Osoite: {userData.user.address}</div>
						<div className="userCity">Kaupunki: {userData.user.city}</div>
						<div className="userEmail">Sähköposti: {userData.user.email}</div>
						<div className="userPhone">Puhelinnumero: {userData.user.phone}</div>
						<div>Tuotteita myynnissä: {ownProducts?.length}</div>
						<div>Oma tähtiarvio:
							<StarPurpleSharpIcon />
							<StarPurpleSharpIcon />
							<StarPurpleSharpIcon />
							<StarBorderPurpleSharpIcon />
							<StarBorderPurpleSharpIcon /></div>
					</div>
				</Grid>}
				{!userData.user.phone && <p>Tietoja ladataan...</p>}
				<Grid item xs={3}>
					<Grid container direction="column" spacing={2}>
						<Grid item>
							<Button variant="contained" onClick={() => setUpdateVisible(true)}>Muokkaa</Button>
							
							{userData && <UpdateProfile // make sure user is fetched before using component 
								isOpen={updateVisible}
								close={(updatedUser: User) => {
									// update profile page with new info when modal is closed
									userData.setUser(updatedUser)
									setUpdateVisible(false)
								}}
								user = {userData.user}
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
				<div>Omat tuotteet:</div>
				<ul>
					{ownProducts && ownProducts?.map((product: Product) => {
						return <li key={"product:" + product.product_id}>{product.title}</li>
					})}
				</ul>
			</div>

		</div>
	)
}

export default Profile
