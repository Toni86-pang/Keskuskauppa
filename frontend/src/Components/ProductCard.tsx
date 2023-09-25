import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Grid } from "@mui/material"
import { useNavigate } from "react-router"

interface Product {
  product_id: number;
  title: string;
  category_id: number;
  subcategory_id: number;
  city: string;
  postalCode: string;
  description: string;
  price: number;
}

interface Props {
  product: Product;
}

const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px"

}

const gridContainerStyle = {
	alignItems: "center"
}

function ProductCard({ product }: Props) {

	const navigate = useNavigate()

	const handleClick = () => {
		navigate(`/product/${product.product_id}`)
	}

	return (
		<Card style={cardStyle}>
			<CardContent>
				<Grid container spacing={2} style={gridContainerStyle}>
					<Grid item xs={3}>
						<CardMedia
							component="img"
							height="80"
							image={"https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"}
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
