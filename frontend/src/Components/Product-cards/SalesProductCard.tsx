import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
// import Button from "@mui/material/Button"
import { Button, Grid } from "@mui/material"
// import { useNavigate } from "react-router"
import { ProductProps, ProductType } from "../../Services-types/types"
import { useNavigate } from "react-router"

const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px"

}

const gridContainerStyle = {
	alignItems: "center"
}

function SalesProductCard({ product, onClose, setCart }: ProductProps) {

	const navigate = useNavigate()

	const handleRemoveFromCart = (product_id: ProductType) => {
		const storageItem = sessionStorage.getItem("myCart")
		const tempCart: ProductType[] = storageItem !== null ? JSON.parse(storageItem) : []
		const filteredCart: ProductType[] = tempCart.filter(function (cartProduct) {return cartProduct.product_id !== product_id})
		sessionStorage.clear()
		if(filteredCart.length > 0 && setCart !== undefined){
			setCart(filteredCart)
			sessionStorage.setItem("myCart", JSON.stringify(filteredCart))
		} else if(setCart !== undefined){
			setCart(null)
		}
	}

	return (
		<Card style={cardStyle}>
			<CardContent>
				<Grid 
					container spacing={2} 
					style={gridContainerStyle} 
				>
					<Grid
						sx={{ cursor: "pointer", m: "15px" }}
						onClick={() => {
							if(onClose !== undefined){
								navigate(`/product/${product.product_id}`)
								onClose()
							}
						}}>
						<Grid sx={{ position: "relative" , left: 10, top: 5 }}>
							<CardMedia
								component="img"
								height="80"
								image={product.product_image ? `data:image/png;base64,${product.product_image}` : "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"}
								alt={product.title}
							/>
						</Grid>
						<Grid item xs={6} sx={{ position: "relative" , left: 10, top: 5 }}>
							<Typography variant="h6" component="div">
								{product.title}
							</Typography>
							<Typography>Hinta {product.price} €</Typography>
						</Grid>
					</Grid>
					<Grid sx={{ position: "relative" , left: "15%" }}>
						<Button variant="contained" color="primary" onClick={() => {
							handleRemoveFromCart(product.product_id)
						}}
						>
											Poista
						</Button>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	)
}

export default SalesProductCard
