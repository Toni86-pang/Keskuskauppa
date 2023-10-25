import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import { Grid } from "@mui/material"
import { ProductProps } from "../../Services-types/types"

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
							{product.product_image ? (
								<CardMedia
									component="img"
									height="80"
									image={`data:image/*;base64,${product.product_image}`}
									alt={product.title}
								/>
							) : (
								<CardMedia
									component="img"
									height="80"
									image={"URL_TO_DEFAULT_IMAGE"}
									alt="Default Image"
								/>
							)}
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
