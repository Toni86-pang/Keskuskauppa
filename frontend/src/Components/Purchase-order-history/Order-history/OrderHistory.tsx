import { fetchOwnBought, fetchOwnSold } from "../../../Services-types/services"
import { BoughtProps, SoldProps } from "../../../Services-types/types"
import { useContext, useEffect, useState } from "react"
import { UserTokenContext } from "../../../App"
import { Button, Container, Stack } from "@mui/material"
import { redirect } from "react-router-dom"
import OrderProductCard from "../../Product-cards/OrderProductCard"

// eslint-disable-next-line react-refresh/only-export-components
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
		const soldProducts = async () => {
			if(!token) return
			const sold = await fetchOwnSold(token)
			setSold(sold)
		}
		const boughtProducts = async () => {
			if(!token) return
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