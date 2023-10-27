import { useState, useEffect, useContext } from "react"
import { useLoaderData, useNavigate, Link, useOutletContext } from "react-router-dom"
import {
	Paper,
	Grid,
	Typography,
	Box,
	Button,
	Rating,
} from "@mui/material"
import DeleteButton from "./DeleteButton"
import UpdateProductModal from "./UpdateProducts"
import { ProductType, User } from "../../Services-types/types"
import { deleteProduct, fetchProduct, fetchStarRating, fetchUser, fetchUserDetailsByUserId } from "../../Services-types/services"
import Notification from "../Verify-notification/Notification"
import { CartContextType, UserTokenContext } from "../../App"

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export async function loader({ params }: any) {
	const productData = await fetchProduct(params.id)
	return productData
}


export default function Product() {
	const [isUpdateModalOpen, setUpdateModalOpen] = useState(false)
	const [showSuccessDeleteNotification, setShowSuccessDeleteNotification] = useState(false)
	const [showErrorDeleteNotification, setShowErrorDeleteNotification] = useState(false)
	const [showNotLoggedInNotif, setShowNotLoggedinNotif] = useState(false)
	const [myProduct, setMyProduct] = useState<boolean>(false)
	const [token] = useContext(UserTokenContext)
	const [sellerUsername, setSellerUsername] = useState<string | null>("")
	const [stars, setStars] = useState(0)
	// const [selectedImage, setSelectedImage] = useState<string | null>(itemData[0].img)
	const [showErrorNotification, setShowErrorNotification] = useState(false)
	const navigate = useNavigate()
	const product = useLoaderData() as ProductType
	const [setCart] = useOutletContext<CartContextType>()

	useEffect(() => {
		const fetchUserDetails = async () => {
			if (!token) return
			const user = await fetchUser(token)

			if (user === undefined) {
				console.error("error fetching user")
				return
			}
			user.user_id !== 0 && product.user_id === user.user_id ? setMyProduct(true) : setMyProduct(false)
		}
		fetchUserDetails()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token])

	const handleDelete = async () => {
		try {
			await deleteProduct(product.product_id)
			setShowSuccessDeleteNotification(true)
			setTimeout(() => {
				navigate("/products")
			}, 1000)
		} catch (error) {
			console.error("Error deleting product", error)
			setShowErrorDeleteNotification(true)
		}
	}


	useEffect(() => {
		const fetchSellerUsernameAndStars = async () => {
			try {
				if (product.user_id) {
					const seller: User = await fetchUserDetailsByUserId(product.user_id)
					const averageStars = await fetchStarRating(product.user_id)
					if (averageStars) {
						setStars(averageStars)
					}
					if (seller.username !== undefined) {
						setSellerUsername(seller.username)
					} else {
						console.error("Error fetching owner user data")
						setSellerUsername("N/A")
					}
				}

			} catch (error) {
				console.error("Error fetching owner user data:", error)
				setSellerUsername("N/A")
			}
		}
		fetchSellerUsernameAndStars()
	}, [product.user_id])

	const handleAddToShoppingCart = (product: ProductType) => {
		const storageItem = sessionStorage.getItem("myCart")
		const tempCart: ProductType[] = storageItem !== null ? JSON.parse(storageItem) : []
		const alreadyInCart = tempCart.find(tempProduct => { return (tempProduct.product_id === product.product_id) })
		if (!alreadyInCart) {
			tempCart.push(product),
			sessionStorage.setItem("myCart", JSON.stringify(tempCart)),
			setCart(tempCart)
		} else { setShowErrorNotification(true) }
	}

	return (
		<>
			<Paper
				sx={{
					p: 2,
					margin: "auto",
					marginTop: 2,
					maxWidth: 600,
					flexGrow: 1,
				}}
			>
				{product.listed ? (
					<>
						<Grid container spacing={5}>
							<Grid item>
								<Typography
									gutterBottom
									variant="subtitle1"
									component="div"
								>
									{product?.title}
								</Typography>
								{product?.product_image && (
									<img
										alt="Product Image"
										src={`data:image/*;base64,${product.product_image}`}
										style={{
											margin: "auto",
											display: "block",
											maxWidth: "270px",
											maxHeight: "270px",
										}}
									/>
								)}
							</Grid>
							<Grid item xl={5} sm container>
								<Grid item xs container direction="column" spacing={4}>
									<Grid item xs sx={{ margin: 4 }}>
										<Typography variant="body2" gutterBottom>
											Hinta:	{product?.price} €
										</Typography>
										{!myProduct ? (
											<>												
												<Typography variant="body2" gutterBottom>
													Myyjän nimi: {sellerUsername}
												</Typography>
												<Typography
													variant="body2"
													color="text.secondary"
												>
													<Box style={{ marginBottom: "8px" }}>
														<Link to={`/user/${product.user_id}`} style={{ color: "#6096ba", textDecoration: "underline" }}>
															Katso profiili
														</Link>
													</Box>
													<Rating name="read-only" value={stars} precision={0.1} readOnly />
												</Typography>
											</>
										) : (
											<></>
										)}
										<Typography
											variant="body2"
											color="text.secondary"
										>
											Kaupunki:	{product?.city}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
										>
											Postinumero:	{product?.postal_code}
										</Typography>
									</Grid>
									{myProduct ? (
										<Grid item>
											<Box>
												<Button variant="outlined" onClick={() => {
													setUpdateModalOpen(true)
												}}>
													Päivitä tuote
												</Button>
												<UpdateProductModal
													isOpen={isUpdateModalOpen}
													onClose={() => setUpdateModalOpen(false)}
													token={token}
													productId={product?.product_id}
													title={product?.title}
													category_id={product?.category_id}
													subcategory_id={product?.subcategory_id}
													city={product?.city.split(",")[0]}
													postal_code={product?.postal_code.split(",")[0]}
													description={product?.description}
													price={product?.price.toString()}
												/>
											</Box>

											{product && (
												<DeleteButton id={product.product_id} onDelete={handleDelete} />
											)}
										</Grid>
									)
										:
										<>
											<Button sx={{
												width: 150, height: 50,
											}} variant="outlined" onClick={() => token ? handleAddToShoppingCart(product) : setShowNotLoggedinNotif(true)}>
												Ostoskoriin
											</Button>
										</>
									}
									{/* Delete success and error notifications */}
									{showSuccessDeleteNotification && (
										<Notification
											open={showSuccessDeleteNotification}
											message="Tuote on poistettu onnistuneesti!"
											type="success"
											onClose={() => setShowSuccessDeleteNotification(false)}
											duration={1500}
										/>
									)}
									{showErrorDeleteNotification && (
										<Notification
											open={showErrorDeleteNotification}
											message="Tapahtui virhe poistettaessa."
											type="error"
											onClose={() => setShowErrorDeleteNotification(false)}
											duration={1500}
										/>
									)}

								</Grid>
							</Grid>
						</Grid>
						<Grid>
							<Grid item marginTop={4}>
								{/* <ImageList
									sx={{ width: 385, height: 100 }}
									cols={10}
									rowHeight={25}
								>
									{itemData.map((item) => (
										<ButtonBase
											key={item.img}
											onClick={() => setSelectedImage(item.img)}
										>
											<ImageListItem>
												<img
													src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
													srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
													alt={item.title}
													loading="lazy"
												/>
											</ImageListItem>
										</ButtonBase>
									))}
								</ImageList> */}
								<Typography variant="body2" gutterBottom>
									Lisätiedot:
								</Typography>
								<Box sx={{ border: 0.1, width: 265, height: 100 }}>{product?.description}</Box>
							</Grid>
						</Grid>
					</>)
					:
					(
						<Typography>Tuote ei ole enää myynnissä.</Typography>
					)}
			</Paper>
			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Tuote on jo ostoskorissa."
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={1500}
				/>
			)}
			{showNotLoggedInNotif && (
				<Notification
					open={showNotLoggedInNotif}
					message="Kirjaudu sisään lisätäksesi tuote ostoskoriin."
					type="error"
					onClose={() => setShowNotLoggedinNotif(false)}
					duration={2000}
				/>
			)}
		</>
	)
}