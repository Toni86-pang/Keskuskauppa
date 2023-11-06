import { useState, useEffect, useContext } from "react"
import { useLoaderData, useNavigate, useOutletContext, useLocation } from "react-router-dom"
import {
	Paper,
	Grid,
	Typography,
	Box,
	Button,
	Rating,
	CardMedia
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
	const [showErrorNotification, setShowErrorNotification] = useState(false)
	const [showSuccessfulAddNotification, setShowSuccessfulAddNotification] = useState(false)
	const navigate = useNavigate()
	const loadedProduct = useLoaderData() as ProductType
	const [product, setProduct] = useState(loadedProduct)
	const [setCart] = useOutletContext<CartContextType>()
	const location = useLocation()

	// set product when page changes. Needed to if switching between products from search results.
	useEffect(() => {
		setProduct(loadedProduct)
	},[location, loadedProduct])

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

	}, [token, product])

	const handleDelete = async () => {
		try {
			await deleteProduct(product.product_id)
			setShowSuccessDeleteNotification(true)
			setTimeout(() => {
				navigate("/profile")
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
			setShowSuccessfulAddNotification(true)
		} else { setShowErrorNotification(true) }
	}

	const handleClick = () => {
		navigate(`/user/${product.user_id}`)
	}

	return (
		<>
			<Paper
				sx={{
					backgroundColor: "#f3f6fa",
					elevation: 5,
				}}
			>
				<Grid container direction="column" spacing={1} justifyContent="center" alignItems="center" pt={3}>
					<Typography variant="h5" fontWeight={"bold"}>{product?.title}</Typography>
				</Grid>
				{product.listed ? (
					<Box>
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
									image = {product.product_image as string}
									alt="Product Image"
									sx={{

										display: "block",
										maxWidth: "300px",
										maxHeight: "300px",
										m: 1,
										p: 4									}}
								/>
							</Grid>
							<Grid item xs={4}>
								<Box p={4}>
									<Typography sx={{fontSize: "1rem"}}>Hinta: {product?.price} €</Typography>
									{!myProduct ? (
										<Box>
											<Typography sx={{fontSize: "1rem"}}>Myyjä:<Button onClick={handleClick}>{sellerUsername}</Button></Typography>
											<Rating name="read-only" value={stars} precision={0.1} readOnly />
										</Box>
									) : (
										<Box></Box>
									)}
									<Typography
										sx={{fontSize: "1rem"}}
									>
											Kaupunki: {product?.city}
									</Typography>
									<Typography
										sx={{fontSize: "1rem"}}
									>
											Postinumero: {product?.postal_code}
									</Typography>
								</Box>
								{myProduct ? (
									<Box pl={4} pb={3}>
										<Button variant="contained" onClick={() => {
											setUpdateModalOpen(true)
										}}>
													Muokkaa tuotetta
										</Button>
										<UpdateProductModal
											product={product}
											isOpen={isUpdateModalOpen}
											onClose={(updatedProduct: ProductType) => {
												setProduct(updatedProduct)
												setUpdateModalOpen(false)
											}}
											token={token}
										/>
										{product && (
											<Box pt={2}>
												<DeleteButton id={product.product_id} onDelete={handleDelete} />
											</Box>
										)}
									</Box>
								)
									:
									(
										<Box pl={4} pb={3}>
											<Button sx={{
												width: 150, height: 50,
											}} variant="contained" onClick={() => token ? handleAddToShoppingCart(product) : setShowNotLoggedinNotif(true)}>
												Ostoskoriin
											</Button>
										</Box>
									)	
								}
							</Grid>
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
							<Grid>
								{/* <Grid item marginTop={4}> */}
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
							</Grid>
						</Grid>
						<Grid container
							spacing={1} 
							direction="row" 
							ml={12}
							pb={10}
						>
							<Grid item xs={8} sx={{
								backgroundColor: "#ffffff",
								justifyContent: "center", 
								alignItems: "center",
								ml: 7,
								borderRadius: "10px"
							}}>
								<Typography sx={{fontSize: "1rem", fontWeight: "bold", p: 3}}>
									Tuotteen tiedot:
								</Typography>
								<Grid item xs={12}>
									<Typography sx={{fontSize: "1rem", pl: 3, pb: 4, pr: 3}}>
										{product?.description}
									</Typography>
								</Grid>
							</Grid>
							{/* </Grid> */}
						</Grid>
					</Box>
				)
					:
					(
						<Grid container
							spacing={2} 
							direction="row" 
							justifyContent="center" 
							alignItems="center"
							p={2}>
							<Grid item xs={3}>
								<Typography>Tuote ei ole enää myynnissä.</Typography>
							</Grid>
						</Grid>
					)
				}
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
			{showSuccessfulAddNotification && (
				<Notification
					open={showSuccessfulAddNotification}
					message="Tuote lisätty ostoskoriin."
					type="success"
					onClose={() => setShowSuccessfulAddNotification(false)}
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