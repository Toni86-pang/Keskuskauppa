import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import { Grid } from "@mui/material"
import { ProductProps } from "../../Services-types/types"

const URL_TO_DEFAULT_IMAGE = "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e" 

const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px",
}

const gridContainerStyle = {
	alignItems: "center"
}

function CheckoutProductCard({ product }: ProductProps) {

	return (
		<Card style={cardStyle} component="div">
			<CardContent>
				<Grid 
					container
					style={gridContainerStyle} 
					component={"div"}
					spacing={2}
					direction="row"
				>
					<Grid
						container
						ml={2}
						component="div"
						direction="row"
						justifyContent="flex-start"
						alignItems="center">
						<Grid item xs={3.5} sx={{ ml: 5, mt: 2 }}>
							{product.product_image ? (
								<CardMedia
									component="img"
									maxHeight="100"
									maxWidth="100"
									image={product.product_image}
									alt={product.title}
								/>
							) : (
								<CardMedia
									component="img"
									height="100"
									width="100"
									image={URL_TO_DEFAULT_IMAGE}
									alt="Default Image"
								/>
							)}
						</Grid>
						<Grid item xs={4.5} m={3} pt={2}>
							<Grid item xs={10} sx={{ m: 2 }}>
								<Typography variant="h6" component="div">
									{product.title}
								</Typography>
								<Typography pb={2} component="div">{product.price} €</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	)
}

export default CheckoutProductCard
