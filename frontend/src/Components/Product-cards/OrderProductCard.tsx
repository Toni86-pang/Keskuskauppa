import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
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
// setRefresh toggles refresh state variable that is used in order history useEffect to reload sales
function OrderProductCard({ product, setRefresh }: OrderCardProps) {
	const [isOpen, setIsopen] = useState(false)

	const handleClick = () => {
		setIsopen(true)
	}

	return (
		<>
			{product &&
				<Card style={cardStyle} component="div">
					<CardContent>
						<Grid container spacing={2} style={gridContainerStyle}>
							<Grid item xs={3}>
								{product.product_image !== "" ? (
									<CardMedia
										component="img"
										height="100"
										width="100"
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
							<Grid item xs={6}>
								<Box p={2}>
									<Typography variant="h6" component="span">
										{product.title}
									</Typography>
									<Typography>{product.price} €</Typography>
									<Typography>Tila: {product.sales_status}
										{product.sales_status === "Peruutettu" && ", "}
										{product.sales_status === "Peruutettu" && (
											<Box>
												{product?.listed ? "palautettu myyntiin" : "ei myynnissä"}
											</Box>
										)} </Typography>
									{product.seller ? (
										<Typography> Myyjä: {product.seller} </Typography>
									) : (
										<Typography> Ostaja: {product.buyer} </Typography>
									)}
								</Box>
							</Grid>
							<Grid item xs={3} style={{ display: "flex", alignItems: "center" }}>
								<Button variant="contained" color="primary" onClick={() => handleClick()}>
									Tilaustiedot
								</Button>
							</Grid>
						</Grid>
					</CardContent>
					{product.seller ? (
						<OrderDetails isSeller={false} isOpen={isOpen} saleId={product.sales_id} onClose={() =>{ setIsopen(false); setRefresh()}} />
					) : (
						<OrderDetails isSeller={true} isOpen={isOpen} saleId={product.sales_id} onClose={() =>{ setIsopen(false); setRefresh()}} />
					)}
				</Card>
			}
		</>
	)
}

export default OrderProductCard
