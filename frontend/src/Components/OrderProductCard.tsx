import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Grid } from "@mui/material"
import { useNavigate } from "react-router"
import { OrderCardProps } from "../types"

const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px"
}

const gridContainerStyle = {
	alignItems: "center"
}

function OrderProductCard({ product }: OrderCardProps) {
	const navigate = useNavigate()

	// Vaihda toiminta niin, että avautuu tuotteen yksityiskohtien modaali
	const handleClick = () => {
		navigate("/product/")
	}

	return (
		<>
			{product &&
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
						<Typography> {product.sales_status} </Typography>
						{product.seller ? (
							<Typography> Myyjä: {product.seller} </Typography>
						):(
							<Typography> Ostaja: {product.buyer} </Typography>
						)}
					</Grid>
					<Grid item xs={3} style={{ display: "flex", alignItems: "center" }}>
						{/* Tänne tulis se linkitys sinne modaaliin */}
						<Button variant="contained" color="primary" onClick={handleClick}>
							Tilaustiedot
						</Button>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
			}
		</>
	)
}

export default OrderProductCard
