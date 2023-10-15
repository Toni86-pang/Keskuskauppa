import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import { Grid } from "@mui/material"
import { ProductProps } from "../types"

const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px"
}

const gridContainerStyle = {
	alignItems: "center"
}

function CheckoutProductCard({ product }: ProductProps) {

	return (
		<Card style={cardStyle}>
			<CardContent>
				<Grid 
					style={gridContainerStyle} 
				>
					<Grid
						sx={{ m: "15px" }}>
						<Grid item xs={6} sm={8} sx={{ position: "relative" , left: 10, top: 5 }}>
							<CardMedia
								component="img"
								height="80"
								image={"https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"}
								alt={product.title}
							/>
						</Grid>
						<Grid item xs={6} md={4} sx={{ position: "relative" , left: 10, top: 5 }}>
							<Typography variant="h6" component="div">
								{product.title}
							</Typography>
							<Typography>Hinta {product.price} €</Typography>
						</Grid>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	)
}

export default CheckoutProductCard
