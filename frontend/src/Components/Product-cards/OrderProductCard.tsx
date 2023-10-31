import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Grid } from "@mui/material"
import { OrderCardProps } from "../../Services-types/types"
import { useState } from "react"
import OrderDetails from "../Purchase-order-history/Order-history/OrderDetails"

const URL_TO_DEFAULT_IMAGE = "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e" 

const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px"
}

const gridContainerStyle = {
	alignItems: "center"
}

function OrderProductCard({ product }: OrderCardProps) {
	const [isOpen, setIsopen] = useState(false)

	const handleClick = () => {
		setIsopen(true)
	}

	return (
		<>
			{product &&
				<Card style={cardStyle}>
					<CardContent>
						<Grid container spacing={2} style={gridContainerStyle}>
							<Grid item xs={3}>
								{product.product_image !== "" ? (
									<CardMedia
										component="img"
										height="80"
										image={product.product_image}
										alt={product.title}
									/>
								) : (
									<CardMedia
										component="img"
										height="80"
										image={URL_TO_DEFAULT_IMAGE}
										alt="Default Image"
									/>
								)}
							</Grid>
							<Grid item xs={6}>
								<Typography variant="h6" component="span">
									{product.title}
								</Typography>
								<Typography>Hinta {product.price} €</Typography>
								<Typography> {product.sales_status}
									{product.sales_status === "Peruutettu" && ", "}
									{product.sales_status === "Peruutettu" && (
										<>
											{product?.listed ? "palautettu myyntiin" : "ei myynnissä"}
										</>
									)} </Typography>
								{product.seller ? (
									<Typography> Myyjä: {product.seller} </Typography>
								) : (
									<Typography> Ostaja: {product.buyer} </Typography>
								)}
							</Grid>
							<Grid item xs={3} style={{ display: "flex", alignItems: "center" }}>
								<Button variant="contained" color="primary" onClick={() => handleClick()}>
									Tilaustiedot
								</Button>
							</Grid>
						</Grid>
					</CardContent>
					{product.seller ? (
						<OrderDetails isSeller={false} isOpen={isOpen} saleId={product.sales_id} onClose={() => setIsopen(false)} />
					) : (
						<OrderDetails isSeller={true} isOpen={isOpen} saleId={product.sales_id} onClose={() => setIsopen(false)} />
					)}
				</Card>
			}
		</>
	)
}

export default OrderProductCard
