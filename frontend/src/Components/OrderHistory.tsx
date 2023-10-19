import { fetchOwnBought, fetchOwnSold } from "../services"
import { BoughtProps, SoldProps } from "../types"
import { useContext, useEffect, useState } from "react"
import { UserTokenContext } from "../App"
import { Button, Container, Stack } from "@mui/material"
import { redirect } from "react-router-dom"
import OrderProductCard from "./OrderProductCard"

export async function loader() {
	const token = localStorage.getItem("token")
	if(!token){
		return redirect("/")
	}
	return null
}

export default function OrderHistory (){
	const [sold, setSold] = useState<SoldProps[]>([])
	const [bought, setBought] = useState<BoughtProps[]>([])
	const [isSoldItem, setIsSoldItem] = useState(true)
	const [token] = useContext(UserTokenContext)
    
	useEffect(() => {
		const getProducts = async () => {
			const sold = await fetchOwnSold(token)
			const bought = await fetchOwnBought(token)
			setBought(bought)
			setSold(sold)
		}
		getProducts()
	}, [token])

	return(
		<Container>
			<h2>Tilaushistoria</h2>
			<Stack spacing={2} direction="row">
				<Button onClick={() => setIsSoldItem(true)} variant="text" color={isSoldItem ? "secondary" : "primary"}>Omat myynnit</Button>
				<div style={{marginTop: "9px"}}>|</div>
				<Button onClick={() => setIsSoldItem(false)} variant="text" color={!isSoldItem ? "secondary" : "primary"}>Omat ostot</Button>
			</Stack>
			{(isSoldItem ? sold : bought).map((product, index) => (
				<OrderProductCard key={"products " + index} product={product} />
			))}
		</Container>
	)
}