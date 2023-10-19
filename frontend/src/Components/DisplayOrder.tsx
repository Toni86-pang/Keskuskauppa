import { List } from "@mui/material"
import { BoughtProps, DisplayOrderProps, SoldProps } from "../types"
import { useEffect, useState } from "react"
import OrderProductCard from "./OrderProductCard"

const DisplayBought = ({ bought, sold }: DisplayOrderProps) => {
	const [boughtList, setBoughtList] = useState<BoughtProps[]>()
	const [soldList, setSoldList] = useState<SoldProps[]>()

	useEffect(() => {
		if(bought){
			setBoughtList(bought)
		}
		if(sold){
			setSoldList(sold)
		}
	}, [bought, sold])

	console.log(bought)
	console.log(sold)

	return (
		<>
			<List>
				{boughtList &&
					boughtList.map((bought, index) => (
						<OrderProductCard key={"products " + index} bought={bought} />
					))}
			</List>
			<List>
				{soldList && soldList.map((sold, index) => (
					<OrderProductCard key={"products " + index} sold={sold} />
				))}
			</List>
		</>
	)
}

export default DisplayBought