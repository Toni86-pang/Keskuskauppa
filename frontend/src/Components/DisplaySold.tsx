import { List } from "@mui/material"
import { DisplaySoldProps } from "../types"
import SoldProductCard from "./SoldProductCard"


const DisplaySold = ({ sold }: DisplaySoldProps) => {

	return (
		<>
			<List>
				{sold && sold.map((sold, index) => (

					<SoldProductCard key={"products " + index} sold={sold} />

				))}
			</List>
		</>
	)
}

export default DisplaySold