import { Button, Grid, List } from "@mui/material"
import { DisplaySoldProps } from "../types"
import SoldProductCard from "./SoldProductCard"
import { useState } from "react"
import OrderDetails from "./OrderDetails"

const gridContainerStyle = {
	alignItems: "center"
}

const DisplaySold = ({ sold }: DisplaySoldProps) => {
	const [isOpen, setIsopen] = useState(false)
	const [saleId, setSaleId] = useState<number>(0)

	const handleClick = (currentSaleId: number) => {
		setSaleId(currentSaleId)
		setIsopen(true)
	}

	return (
		<>
			<List>
				{sold && sold.map((sold, index) => (
					<Grid key={"products " + index} container spacing={2} style={gridContainerStyle} >
						<Grid item xs={9}>
							<SoldProductCard  sold={sold} />
						</Grid>
						<Grid item xs={3}>
							<Button variant="contained" color="primary" onClick={() => handleClick(sold.sales_id)}>Tilaustiedot</Button>
						</Grid>

					</Grid>
				))}
			</List>
			<OrderDetails isOpen={isOpen} saleId={saleId} onClose={() => setIsopen(false)} />
		</>
	)
}

export default DisplaySold