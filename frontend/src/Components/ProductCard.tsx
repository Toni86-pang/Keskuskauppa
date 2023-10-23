import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Grid } from "@mui/material"
import { useNavigate } from "react-router"
import { ProductProps } from "../types"

const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px"

}

const gridContainerStyle = {
	alignItems: "center"
}

function ProductCard({ product }: ProductProps) {

	const navigate = useNavigate()

	const handleClick = () => {
		navigate(`/product/${product.product_id}`)
	}
	const defaultImageUrl = "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"

	return (
		<Card style={cardStyle}>
			<CardContent>
				<Grid container spacing={2} style={gridContainerStyle}>
					<Grid item xs={3}>
						<CardMedia
							component="img"
							height="80"
							// Check if product.product_image is not null, if so, use the image from the database. Otherwise, use the default image.
							image={product.product_image ? `data:image/*;base64,${product.product_image}` : defaultImageUrl}
							alt={product.title}
						/>
					</Grid>
					<Grid item xs={6}>
						<Typography variant="h6" component="div">
							{product.title}
						</Typography>
						<Typography>Hinta {product.price} €</Typography>
					</Grid>
					<Grid item xs={3} style={{ display: "flex", alignItems: "center" }}>
						<Button variant="contained" color="primary" onClick={handleClick}>
              Katso tuote
						</Button>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	)
}

export default ProductCard
