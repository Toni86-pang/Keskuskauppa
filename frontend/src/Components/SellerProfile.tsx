import { useEffect, useState } from "react"
import { Grid } from "@mui/material"
import Divider from "@mui/material/Divider"
import { ProductType, User } from "../types"
import ProductCard from "./ProductCard"
//import Rating from "@mui/material/Rating"
import Notification from "./Notification"
import { fetchUserDetailsByUserId, fetchUsersProducts } from "../services"
import { useLoaderData } from "react-router-dom"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loader({ params }: any) {
	const userData = await fetchUserDetailsByUserId(params.id)
	return userData
}

function SellerProfile() {
	const [ownProducts, setOwnProducts] = useState<ProductType[]>([])
	const [showSuccessDeleteNotification, setShowSuccessDeleteNotification] = useState(false)
	const [showErrorDeleteNotification, setShowErrorDeleteNotification] = useState(false)
	const user = useLoaderData() as User

	const fetchProducts = async (id: number) => {
		const products = await fetchUsersProducts(id)
		setOwnProducts(products)
	}

	useEffect(() => {
		fetchProducts(user.user_id)
	}, [user])

	const joinDate: string | undefined = user?.reg_day
	let formattedJoinDate: string | undefined = undefined
	if (joinDate) {
		const year: string = joinDate.substring(0, 4)
		const month: string = joinDate.substring(5, 7)
		const day: string = joinDate.substring(8, 10)
		formattedJoinDate = `${day}.${month}.${year}`
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
					<div><img src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e" style={{
						margin: "auto",
						display: "block",
						maxWidth: "220px",
						maxHeight: "220px",
					}} /></div>
				</Grid>
				{user && <Grid item xs={5}>
					<div className="user">
						<div className="userUsername">Käyttäjänimi: {user.username}</div>
						<div className="userAddress">Rekisteröintipäivämäärä: {formattedJoinDate}</div>
						<div className="userRegDay">Kaupunki: {user.city}</div>
						<div className="userPostalCode">Postinumero: {user.postal_code}</div>
						<div>Tuotteita myynnissä: {ownProducts?.length}</div>
						{/* <div>Myyjän tähtiarvio:
							<Rating name="read-only" value={3.33} precision={0.1} readOnly />
						</div> */}
					</div>
				</Grid>}
				<Grid item xs={3}>
					<Grid container direction="column" spacing={2}>


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

					</Grid>
				</Grid>
			</Grid>
			<div className="ownProducts">
				<div style={{ marginBottom: "10px" }}>Myytävät tuotteet:</div>

				<Divider variant="middle" style={{ marginBottom: "10px" }} />
				{ownProducts.length > 0 ? (
					ownProducts && ownProducts?.map((product: ProductType) => {
						return <ProductCard product={product} key={"own product: " + product.product_id} />
					}))
					:
					(
						<p>Ei omia tuotteita. Kun lisäät tuotteen myyntiin, näet sen täällä.</p>
					)
				}
			</div>

		</div>
	)
}

export default SellerProfile
