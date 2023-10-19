import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Grid } from "@mui/material"
import { BoughtCardProps } from "../types"
import { useState } from "react"
import OrderDetails from "./OrderDetails"

const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px"

}

const gridContainerStyle = {
	alignItems: "center"
}

function BoughtProductCard({ bought }: BoughtCardProps) {
	const [isOpen, setIsopen] = useState(false)
	const [saleId, setSaleId] = useState<number>(0)

	const handleClick = (currentSaleId: number) => {
		setSaleId(currentSaleId)
		setIsopen(true)
	}

	return (
		<Card style={cardStyle}>
			{bought &&
			<CardContent>
				<Grid container spacing={2} style={gridContainerStyle}>
					<Grid item xs={3}>
						<CardMedia
							component="img"
							height="80"
							image={"https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"}
							alt={bought.title}
						/>
					</Grid>
					<Grid item xs={6}>
						<Typography variant="h6" component="div">
							{bought.title}
						</Typography>
						<Typography>Hinta {bought.price} €</Typography>
						<Typography> {bought.sales_status} </Typography>
						<Typography> Myyjä: {bought.seller} </Typography>
					</Grid>
					<Grid item xs={3} style={{ display: "flex", alignItems: "center" }}>
						{/* Tänne tulis se linkitys sinne modaaliin */}
						<Button variant="contained" color="primary" onClick={() => handleClick(bought.sales_id)}>
							Tilaustiedot
						</Button>
					</Grid>
				</Grid>
			</CardContent>
			}
			<OrderDetails isSeller={false} isOpen={isOpen} saleId={saleId} onClose={() => setIsopen(false)} />
		</Card>
	)
}

export default BoughtProductCard
