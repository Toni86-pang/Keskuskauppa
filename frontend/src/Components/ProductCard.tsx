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

	let imageSrc = ""

	if (product.product_image && product.product_image instanceof Buffer) {
	// Convert the Buffer to a Base64 string
		const base64String = product.product_image.toString("base64")
		imageSrc = `data:image/*;base64,${base64String}`
	} else {
	// Use a default image source or some placeholder
		imageSrc = "https://example.com/default-image.jpg"
	}

	// const defaultImageUrl = "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"
	console.log("Product image data:", product.product_image)
	return (
		<Card style={cardStyle}>
			<CardContent>
				<Grid container spacing={2} style={gridContainerStyle}>
					<Grid item xs={3}>
						<CardMedia
							component="img"
							height="80"
							image={imageSrc}
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
