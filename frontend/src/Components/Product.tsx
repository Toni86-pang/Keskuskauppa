import { useState, useEffect } from "react"
import { useLoaderData, useNavigate } from "react-router-dom" 
import axios from "axios"
import {
	Paper,
	Grid,
	ButtonBase,
	Typography,
	Box,
	ImageList,
	ImageListItem,
} from "@mui/material"
import StarBorderPurple500SharpIcon from "@mui/icons-material/StarBorderPurple500Sharp"
import StarPurple500SharpIcon from "@mui/icons-material/StarPurple500Sharp"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import Link from "@mui/material/Link"
import DeleteButton from "./DeleteButton"

interface Product {
	product_id: number
	title: string
	category_ID: number
	subcategory_ID: number
	location: string
	description: string
	price: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export function loader({ params }: any) {
	return params.id
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

///////////

export default function Product() {
	const [product, setProduct] = useState<Product | null>(null)
	// const [loggedIn, setLoggedIn] = useState(true)
	const [selectedImage, setSelectedImage] = useState<string | null>(
		itemData[0].img
	)
	const navigate = useNavigate()
	const id = parseInt(useLoaderData() as string, 10)

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const response = await axios.get("/api/product/" + id)
				setProduct(response.data)
			} catch (error) {
				console.error("error fetching products", error)
			}
		}
		fetchProduct()
	}, [id])

	const handleDelete = async () => {
		try {
			await axios.delete(`/api/product/delete/${product?.product_id}`)
		// Perform any other necessary actions here after deletion
		} catch (error) {
			console.error("error deleting product", error)
		}
finally{
	navigate("/product")
}
	}
	console.log("producst",product)
	return (
		<div>
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
					<Link
						underline="hover"
						sx={{ display: "flex", alignItems: "center" }}
						color="inherit"
						href="/product"
					>
						Kaikki tuotteet
					</Link>
					<Typography
						sx={{ display: "flex", alignItems: "center" }}
						color="text.primary"
					>
						{product?.title}
					</Typography>
				</Breadcrumbs>
			</div>
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
									{product?.price} €
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Myyjän nimi
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
								<Typography
									variant="body2"
									color="text.secondary"
								>
									{product?.location}
								</Typography>
							</Grid>
							
							<Grid item>
								{/* {loggedIn ? (
									<div>
										<Button variant="outlined">
											Ostoskoriin
										</Button>
										<Button variant="outlined">
											Viesti
										</Button>
									</div>
								) : (
									<Button
										variant="outlined"
										href="/login"
										size="small"
									>
										Kirjaudu sisään ostaaksesi
									</Button>
								)} */}
								{product && <DeleteButton id={product.product_id} onDelete={handleDelete} />}
							</Grid>
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
						<Box sx={{ border: 0.1 , width: 265, height: 100  }}>{product?.description}</Box>
					</Grid>
				</Grid>
			</Paper>
		</div>
	)
}
