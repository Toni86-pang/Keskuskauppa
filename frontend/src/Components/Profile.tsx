import { useState, useEffect } from "react"
// import { useLoaderData } from "react-router-dom"
import axios from "axios"
import { Grid, Breadcrumbs, Link, Typography, Button, } from "@mui/material"
import StarBorderPurpleSharpIcon from "@mui/icons-material/StarBorderPurple500Sharp"
import StarPurpleSharpIcon from "@mui/icons-material/StarPurple500Sharp"


// const DEBUG = true
const DEBUGTOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5pc3UiLCJpZCI6NDcsImlhdCI6MTY5MzI5NjU2OX0.bF2pn9OekMrhRyA9SFf1-698iVRuBPmNBf2d7DUBEvQ"


interface User {
	userId: number
	username: string
	name: string
	email: string
	phone: string
	address: string
	city: string
}

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


function Profile() {

	const [user, setUser] = useState<User | null>(null)
	const [token] = useState(DEBUGTOKEN)
	const [ownProducts, setOwnProducts] = useState<Product[] | null>(null)
	// const id = useLoaderData() as string
	const id = 47



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
	}, [id, token])

	useEffect(() => {
		const fetchOwnProducts = async () => {
			try {
				const response = await axios("/api/product/user/" + id)
				setOwnProducts(response.data)

			} catch (error) {
				console.error("error fetching user	", error)
			}
		}
		fetchOwnProducts()
	})


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
				<Grid item xs={5}>
					<div className="user">
						<div className="userName">Nimi: {user?.name}</div>
						<div className="userUsername">Käyttäjänimi: {user?.username}</div>
						<div className="userAddress">Osoite: {user?.address}</div>
						<div className="userCity">Kaupunki: {user?.city}</div>
						<div className="userEmail">Sähköposti: {user?.email}</div>
						<div className="userPhone">Puhelinnumero: {user?.phone}</div>
						<div>Tuotteita myynnissä: {ownProducts?.length}</div>
						<div>Oma tähtiarvio: 
							<StarPurpleSharpIcon />
							<StarPurpleSharpIcon />
							<StarPurpleSharpIcon />
							<StarBorderPurpleSharpIcon />
							<StarBorderPurpleSharpIcon /></div>
					</div>

				</Grid>
				<Grid item xs={3}>
					<Grid container direction="column" spacing={2}>
						<Grid item><Button variant="contained">Muokkaa</Button></Grid>
						<Grid item><Button variant="contained">Vaihda salasana</Button></Grid>
						<Grid item><Button variant="contained">Poista profiili</Button></Grid>
						
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
