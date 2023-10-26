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
	if (!token) {
		return redirect("/")
	}
	return null
}

export default function OrderHistory() {
	const [isSoldItem, setIsSoldItem] = useState(true)
	const [soldWaiting, setSoldWaiting] = useState<SoldProps[]>([])
	const [soldSent, setSoldSent] = useState<SoldProps[]>([])
	const [soldReceived, setSoldReceived] = useState<SoldProps[]>([])
	const [soldCancelled, setSoldCancelled] = useState<SoldProps[]>([])
	const [boughtWaiting, setBoughtWaiting] = useState<BoughtProps[]>([])
	const [boughtSent, setBoughtSent] = useState<BoughtProps[]>([])
	const [boughtCancelled, setBoughtCancelled] = useState<BoughtProps[]>([])
	const [boughtReceived, setBoughtReceived] = useState<BoughtProps[]>([])
	const [token] = useContext(UserTokenContext)

	useEffect(() => {
		if (!token) return

		const fetchData = async () => {
			try {
				const sold = await fetchOwnSold(token)
				const bought = await fetchOwnBought(token)

				setSoldWaiting(sold.filter((item) => item.sales_status === "Odottaa lähetystä"))
				setSoldSent(sold.filter((item) => item.sales_status === "Lähetetty"))
				setSoldReceived(sold.filter((item) => item.sales_status === "Vastaanotettu"))
				setSoldCancelled(sold.filter((item) => item.sales_status === "Peruutettu"))

				setBoughtWaiting(bought.filter((item) => item.sales_status === "Odottaa lähetystä"))
				setBoughtSent(bought.filter((item) => item.sales_status === "Lähetetty"))
				setBoughtReceived(bought.filter((item) => item.sales_status === "Vastaanotettu"))
				setBoughtCancelled(bought.filter((item) => item.sales_status === "Peruutettu"))
			} catch (error) {
				console.error("Error fetching own sales:", error)
			}
		}

		fetchData()
	}, [token])


	const renderSold = (saleStatus: string, soldProducts: SoldProps[]) => {
		return (
			<>
				<h3>{saleStatus}</h3>
				{
					soldProducts.map((product, index) => {
						return <OrderProductCard key={saleStatus + index} product={product} />
					})
				}
			</>)
	}

	const renderBought = (saleStatus: string, boughtProducts: BoughtProps[]) => {
		return (
			<>
				<h3>{saleStatus}</h3>
				{
					boughtProducts.map((product, index) => {
						return <OrderProductCard key={saleStatus + index} product={product} />
					})
				}
			</>)
	}

	return (
		<Container>
			<h2>Tilaushistoria</h2>
			<Stack spacing={2} direction="row">
				<Button onClick={() => setIsSoldItem(true)} variant="text" color={isSoldItem ? "secondary" : "primary"}>Omat myynnit</Button>
				<div style={{ marginTop: "9px" }}>|</div>
				<Button onClick={() => setIsSoldItem(false)} variant="text" color={!isSoldItem ? "secondary" : "primary"}>Omat ostot</Button>
			</Stack>
			{isSoldItem ?
				<>
					{soldWaiting.length > 0 && renderSold("Odottaa lähetystä", soldWaiting)}
					{soldSent.length > 0 && renderSold("Lähetetty", soldSent)}
					{soldReceived.length > 0 && renderSold("Vastaanotettu", soldReceived)}
					{soldCancelled.length > 0 && renderSold("Peruutettu", soldCancelled)}

				</> :
				<>
					{boughtSent.length > 0 && renderBought("Lähetetty", boughtSent)}
					{boughtWaiting.length > 0 && renderBought("Odottaa lähetystä", boughtWaiting)}
					{boughtReceived.length > 0 && renderBought("Vastaanotettu", boughtReceived)}
					{boughtCancelled.length > 0 && renderBought("Peruutettu", boughtCancelled)}

				</>}

		</Container>
	)
}