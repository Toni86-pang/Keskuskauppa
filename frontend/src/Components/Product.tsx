import { useState, useEffect, useContext } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"
import {
	Paper,
	Grid,
	ButtonBase,
	Typography,
	Box,
	ImageList,
	ImageListItem,
	Button,
} from "@mui/material"
import StarBorderPurple500SharpIcon from "@mui/icons-material/StarBorderPurple500Sharp"
import StarPurple500SharpIcon from "@mui/icons-material/StarPurple500Sharp"
import DeleteButton from "./DeleteButton"
import UpdateProductModal from "./UpdateProducts"
import { ProductType } from "../types"
import { deleteProduct, fetchProduct,  fetchUser, fetchUsernameByUserId } from "../services"
import Notification from "./Notification"
import { UserTokenContext } from "../App"

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export async function loader({ params }: any) {
	const productData = await fetchProduct(params.id)
	return productData
}

// Imaget testiä varten ////////////////////////

const itemData = [
	{
		img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
		title: "Breakfast",
	},
	{
		img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
		title: "Burger",
	},
	{
		img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
		title: "Camera",
	},
	{
		img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
		title: "Coffee",
	},
	{
		img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
		title: "Hats",
	},
	{
		img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
		title: "Honey",
	},
	{
		img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
		title: "Basketball",
	},
]

export default function Product() {
	const [isUpdateModalOpen, setUpdateModalOpen] = useState(false)
	const [showSuccessDeleteNotification, setShowSuccessDeleteNotification] = useState(false)
	const [showErrorDeleteNotification, setShowErrorDeleteNotification] = useState(false)
	const [hidden, setHidden] = useState<boolean>(false)
	const [token] = useContext(UserTokenContext)
	const [ownerUsername, setOwnerUsername] = useState<string | null>("")
	const [selectedImage, setSelectedImage] = useState<string | null>(itemData[0].img)
	const navigate = useNavigate()
	const product = useLoaderData() as ProductType
		
	
	const fetchUserDetails = async () => {
		const user = await fetchUser(token)

		if (user === undefined) {
			console.error("error fetching user")
			return
		}
		user.user_id !== 0 && product.user_id === user.user_id ? setHidden(true) : setHidden(false)
	}

	useEffect(() => {
		fetchUserDetails()
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

	const fetchUsernameForDisplay = async () => {
		try {
			const username = await fetchUsernameByUserId(product.user_id)
			if (username !== undefined) {
				setOwnerUsername(username)
			} else {
				console.error("Error fetching owner user data")
				setOwnerUsername("N/A")
			}
		} catch (error) {
			console.error("Error fetching owner user data:", error)
			setOwnerUsername("N/A")
		}
	}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		fetchUsernameForDisplay()
	}, [])

	return (
		<div>
			<Paper
				sx={{
					p: 2,
					margin: "auto",
					marginTop: 2,
					maxWidth: 600,
					flexGrow: 1,
				}}
			>
				<Grid container spacing={5}>
					<Grid item>
						<Typography
							gutterBottom
							variant="subtitle1"
							component="div"
						>
							{product?.title}
						</Typography>
						{selectedImage && (
							<img
								alt="Image"
								src={selectedImage}
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
								{!hidden ? (
									<>
										<Typography variant="body2" gutterBottom>
											Myyjän nimi: {ownerUsername}
										</Typography>

										<Typography
											variant="body2"
											color="text.secondary"
											marginTop={1}
										>
											<StarPurple500SharpIcon />
											<StarPurple500SharpIcon />
											<StarPurple500SharpIcon />
											<StarBorderPurple500SharpIcon />
											<StarBorderPurple500SharpIcon />
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
							{hidden ? (
								<Grid item>
									<div>
										<Button variant="outlined" onClick={() => { 
											setUpdateModalOpen(true) 
										}}>
										Päivitä tuote
										</Button>
										<UpdateProductModal
											isOpen={isUpdateModalOpen}
											onClose={() => setUpdateModalOpen(false)}
											productId={product?.product_id || 0}
											title={product?.title || ""}
											category_id={product?.category_id || 0}
											subcategory_id={product?.subcategory_id || 0}
											city={product?.city.split(",")[0] || ""}
											postal_code={product?.postal_code.split(",")[0] || ""}
											description={product?.description || ""}
											price={product?.price || 0}
										/>
									</div>

									{product && (
										<DeleteButton id={product.product_id} onDelete={handleDelete} />
									)}
								</Grid>
							)
								:
								<></>
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
					<Grid item marginTop={-4}>
						<ImageList
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
						</ImageList>
						<Typography variant="body2" gutterBottom>
							Lisätiedot:
						</Typography>
						<Box sx={{ border: 0.1, width: 265, height: 100 }}>{product?.description}</Box>
					</Grid>
				</Grid>
			</Paper>
		</div>
	)
}