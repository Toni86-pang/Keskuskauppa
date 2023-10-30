import { useState } from "react"
import { Button, Grid, Rating, Stack } from "@mui/material"
import Divider from "@mui/material/Divider"
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
					<div>{user?.user_image && (
						<img
							alt="Seller Image"
							// src={`data:image/*;base64,${user.user_image}`}
							src={user.user_image as string}
							style={{
								margin: "auto",
								display: "block",
								maxWidth: "270px",
								maxHeight: "270px",
							}}
						/>
					)}
					</div>
				</Grid>
				{user && <Grid item xs={5}>
					<div className="user">
						<div className="userUsername">Käyttäjänimi: {user.username}</div>
						<div className="userAddress">Rekisteröintipäivämäärä: {formattedJoinDate}</div>
						<div className="userRegDay">Kaupunki: {user.city}</div>
						<div className="userPostalCode">Postinumero: {user.postal_code}</div>
						<div>Tuotteita myynnissä: {products?.length}</div>
						<div>Myyjän tähtiarvio:
							<Rating name="read-only" value={stars} precision={0.1} readOnly />
						</div>
					</div>
				</Grid>}

			</Grid>
			<Stack spacing={2} direction="row">
				<Button onClick={() => setShowProducts(true)} variant="text" color={showProducts ? "secondary" : "primary"}>Myyjän ilmoitukset</Button>
				<div style={{ marginTop: "9px" }}>|</div>
				<Button onClick={() => setShowProducts(false)} variant="text" color={!showProducts ? "secondary" : "primary"}>Myyjän arvostelut</Button>
			</Stack>
			{showProducts ?
				<div className="ownProducts">
					<Divider variant="middle" style={{ marginBottom: "10px" }} />
					{products.length > 0 ? <DisplayProducts productList={products} /> :
						(
							<p>Ei tuotteita.</p>
						)}
				</div> :
				<div className="reviews">
					<Divider variant="middle" style={{ marginBottom: "10px" }} />
					{<ListReviews sellerId={user.user_id} isOwn={false} />}
				</div>}

		</div>
	)
}

export default SellerProfile
