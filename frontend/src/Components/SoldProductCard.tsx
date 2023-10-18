import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { Grid } from "@mui/material"
import { useNavigate } from "react-router"
import { SoldCardProps } from "../types"

const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px"

}

const gridContainerStyle = {
	alignItems: "center"
}

function SoldProductCard({ sold }: SoldCardProps) {
	const navigate = useNavigate()

	// Vaihda toiminta niin, että avautuu tuotteen yksityiskohtien modaali
	const handleClick = () => {
		navigate("/")
	}

	return (
		<Card style={cardStyle}>
			{sold &&
			<CardContent>
				<Grid container spacing={2} style={gridContainerStyle}>
					<Grid item xs={3}>
						<CardMedia
							component="img"
							height="80"
							image={"https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"}
							alt={sold.title}
						/>
					</Grid>
					<Grid item xs={6}>
						<Typography variant="h6" component="div">
							{sold.title}
						</Typography>
						<Typography>Hinta {sold.price} €</Typography>
						<Typography> {sold.sales_status} </Typography>
						<Typography> Ostaja: {sold.buyer} </Typography>
					</Grid>
					<Grid item xs={3} style={{ display: "flex", alignItems: "center" }}>
						{/* Tänne tulis se linkitys sinne modaaliin */}
						<Button variant="contained" color="primary" onClick={handleClick}>
                            Tilaustiedot
						</Button>
					</Grid>
				</Grid>
			</CardContent>
			}
		</Card>
	)
}

export default SoldProductCard
