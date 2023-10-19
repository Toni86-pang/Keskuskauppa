import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Grid } from "@mui/material"
import { useNavigate } from "react-router"
import { BoughtProps, OrderCardProps, SoldProps } from "../types"
import { useEffect, useState } from "react"

const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px"
}

const gridContainerStyle = {
	alignItems: "center"
}

function OrderProductCard({ bought, sold }: OrderCardProps) {
	const[boughtItem, setBoughtItem] = useState<BoughtProps>()
	const[soldItem, setSoldItem] = useState<SoldProps>()
	const navigate = useNavigate()

	useEffect(() => {
		if(bought){
			setBoughtItem(bought)
		}
		if(sold){
			setSoldItem(sold)
		}
	}, [bought, sold])

	// Vaihda toiminta niin, että avautuu tuotteen yksityiskohtien modaali
	const handleClick = () => {
		navigate("/product/")
	}

	return (
		<>
			{boughtItem &&
		<Card style={cardStyle}>
			<CardContent>
				<Grid container spacing={2} style={gridContainerStyle}>
					<Grid item xs={3}>
						<CardMedia
							component="img"
							height="80"
							image={"https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"}
							alt={boughtItem.title}
						/>
					</Grid>
					<Grid item xs={6}>
						<Typography variant="h6" component="div">
							{boughtItem.title}
						</Typography>
						<Typography>Hinta {boughtItem.price} €</Typography>
						<Typography> {boughtItem.sales_status} </Typography>
						<Typography> Myyjä: {boughtItem.seller} </Typography>
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
			{soldItem &&
			<Card style={cardStyle}>
				<CardContent>
					<Grid container spacing={2} style={gridContainerStyle}>
						<Grid item xs={3}>
							<CardMedia
								component="img"
								height="80"
								image={"https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"}
								alt={soldItem.title}
							/>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="h6" component="div">
								{soldItem.title}
							</Typography>
							<Typography>Hinta {soldItem.price} €</Typography>
							<Typography> {soldItem.sales_status} </Typography>
							<Typography> Ostaja: {soldItem.buyer} </Typography>
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
