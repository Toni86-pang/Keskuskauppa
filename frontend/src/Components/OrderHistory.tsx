import { fetchOwnBought, fetchOwnSold } from "../services"
import { BoughtProps, SoldProps } from "../types"
import { useContext, useEffect, useState } from "react"
import { UserTokenContext } from "../App"
import { Button, Container, Stack } from "@mui/material"
import DisplayBought from "./DisplayBought"
import DisplaySold from "./DisplaySold"

export default function OrderHistory (){
	const [sold, setSold] = useState<SoldProps[]>([])
	const [bought, setBought] = useState<BoughtProps[]>([])
	const [whichList, setWhichList] = useState<string>("sold")
	const [token] = useContext(UserTokenContext)
    
	useEffect(() => {
		const soldProducts = async () => {
			const sold = await fetchOwnSold(token)
			setSold(sold)
		}
		const boughtProducts = async () => {
			const bought = await fetchOwnBought(token)
			setBought(bought)
		}
		soldProducts()
		boughtProducts()
	}, [token])

	return(
		<Container>
			<h2>Tilaushistoria</h2>
			<Stack spacing={2} direction="row">
				<Button onClick={() => setWhichList("sold")} variant="text" color={whichList === "sold" ? "secondary" : "primary"}>Omat myynnit</Button>
				<div style={{marginTop: "9px"}}>|</div>
				<Button onClick={() => setWhichList("bought")} variant="text" color={whichList === "bought" ? "secondary" : "primary"}>Omat ostot</Button>
			</Stack>
			{whichList === "sold" ? (<DisplaySold sold={sold} />):(<DisplayBought bought={bought}/>)}
		</Container>
	)
}