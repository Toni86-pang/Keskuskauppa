import { List } from "@mui/material"
import { DisplayBoughtProps } from "../types"
import BoughtProductCard from "./BoughtProductCard"

const DisplayBought = ({ bought }: DisplayBoughtProps) => {

	return (
		<List>
			{bought && bought.map((bought, index) => (
				<BoughtProductCard key={"products " + index} bought={bought} />
			))}
		</List>
	)
}

export default DisplayBought