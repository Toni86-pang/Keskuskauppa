import { useState, useEffect } from "react"
// import { useLoaderData } from "react-router-dom"
import axios from "axios"
import { Grid, Breadcrumbs, Link, Typography, Button, } from "@mui/material"
import Divider from "@mui/material/Divider"
import VerifyDialog from "./VerifyDialog"
import { useNavigate } from "react-router-dom"
import UpdateProfile from "./UpdateProfile"
import ProductCard from "./ProductCard"
import Rating from "@mui/material/Rating"
import Crumbs from "./Crumbs"

//const DEBUG = true
const DEBUGTOKEN2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pc3N1bGkiLCJpZCI6NjIsImlhdCI6MTY5NDE1NDM0NH0.DFPZ-EXLcJEyKu_6PkJK_QA5DFT9TB9aOlgW9vax750"

interface User {
	userId: number
	username: string
	name: string
	email: string
	phone: string
	address: string
	city: string
	postal_code: string
}

interface Product {
	product_id: number
	user_id: number
	title: string
	category_id: number
	subcategory_id: number
	city: string
	postal_code: string
	description: string
	price: number
	// product_image?: any
}

function Profile() {

	const [user, setUser] = useState<User | null>(null)
	const [updateVisible, setUpdateVisible] = useState(false)
	const [token] = useState(DEBUGTOKEN2)
	const [ownProducts, setOwnProducts] = useState<Product[] | null>(null)
	const [verifyOpen, setVerifyOpen] = useState(false)
	const navigate = useNavigate()

	// const id = useLoaderData() as string
	const userId = 62

	const handleVerification = () => {
		setVerifyOpen(true)
	}

	const deleteProfile = async () => {
		try {
			await axios.delete("/api/users/delete", {
				headers: {
					"Authorization": `Bearer ${token}`
				}
			})
			navigate("/")
		} catch (error) {
			console.error("error deleting user	", error)
		}
	}

	const verifyDialogProps = {
		messageText: "Haluatko varmasti poistaa profiilisi?",
		acceptButtonText: "Poista",
		isOpen: verifyOpen,
		setOpen: setVerifyOpen,
		onAccept: deleteProfile
	}

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await axios("/api/users/user/", {
					headers: {
						"Authorization": `Bearer ${token}`
					}
				})
				setUser(response.data)
			} catch (error) {
				console.error("error fetching user	", error)
			}
		}
		fetchUser()
	}, [userId, token])

	useEffect(() => {
		const fetchOwnProducts = async () => {
			try {
				const response = await axios("/api/product/user/" + userId)
				setOwnProducts(response.data)

			} catch (error) {
				console.error("error fetching user	", error)
			}
		}
		fetchOwnProducts()
	})

	interface Crumb {
		label: string
		url?: string
	}

	const breadcrumbs : Crumb[] = [
		{ label: "Home", url: "/" },
		{ label: "Category", url: "/category" },
		{ label: "Subcategory", url: "/category/subcategory" },
		{ label: "Current Page" },
	]

	return (

		<div className="profile">
			<Crumbs items={breadcrumbs}/>
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
				<Grid item xs={5}>
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

				</Grid>
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
								token={token}
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
				{ownProducts && ownProducts?.map((product: Product) => {
					return <ProductCard product={product} key={"own product: " + product.product_id} />
				})}
			</div>

		</div>
	)
}

export default Profile
