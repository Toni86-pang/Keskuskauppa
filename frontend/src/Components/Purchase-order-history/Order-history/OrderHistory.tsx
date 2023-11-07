import { fetchOwnBought, fetchOwnSold } from "../../../Services-types/services"
import { BoughtProps, SoldProps } from "../../../Services-types/types"
import { useContext, useEffect, useState } from "react"
import { UserTokenContext } from "../../../App"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { Badge, Button, Paper, Divider, Container, Stack, Box, Typography } from "@mui/material"
import { redirect } from "react-router-dom"
import OrderProductCard from "../../Product-cards/OrderProductCard"
import { useNewSaleAndReviewContext } from "../../../NewSaleAndReviewContext"

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
	const [refresh, setRefresh] = useState(false)
	const [token] = useContext(UserTokenContext)
	const { setSaleCount } = useNewSaleAndReviewContext()

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

	}, [token, refresh])

	useEffect(() => {
		setSaleCount(soldWaiting.length + boughtSent.length)
	}, [soldWaiting, boughtSent, setSaleCount])


	const renderSold = (saleStatus: string, soldProducts: SoldProps[]) => {
		return (
			<Box>
				<Typography sx={{fontSize: "1.1rem"}}>{saleStatus}</Typography>
				{
					soldProducts.map((product, index) => {
						return <OrderProductCard key={saleStatus + index + product.title} product={product} setRefresh={() => setRefresh(!refresh)} />
					})
				}
			</Box>)
	}

	const renderBought = (saleStatus: string, boughtProducts: BoughtProps[]) => {
		return (
			<Box>
				<Typography sx={{fontSize: "1.1rem"}}>{saleStatus}</Typography>
				{
					boughtProducts.map((product, index) => {
						return <OrderProductCard key={saleStatus + index + product.title} product={product} setRefresh={() => setRefresh(!refresh)} />
					})
				}
			</Box>)
	}

	const theme = createTheme({
		components: {
			MuiButton: {
				styleOverrides: {
					textSecondary: {
						fontWeight: "bold",
					},
				},
			},
		},
		palette: {
			secondary: {
				main: "#405e8c",
			}
		}
	})

	return (
		<ThemeProvider theme={theme}>
			<Paper sx={{
				backgroundColor: "#f3f6fa",
				elevation: 5,
				p: 3,
				minHeight: "500px"
			}}>
				<Container>
					<Typography variant="h5" style={{textAlign: "center"}} mt={2}>Tilaushistoria</Typography>
					<Stack spacing={2} direction="row" justifyContent="center" alignItems="center" pt={3} >
						<Badge badgeContent={soldWaiting.length} color="info" >
							<Button onClick={() => setIsSoldItem(true)} variant="text" color={isSoldItem ? "secondary" : "primary"}>Omat myynnit</Button>
						</Badge>
						<Box style={{ marginTop: "9px" }}>|</Box>
						<Badge badgeContent={boughtSent.length} color="info" >
							<Button onClick={() => setIsSoldItem(false)} variant="text" color={!isSoldItem ? "secondary" : "primary"}>Omat ostot</Button>
						</Badge>
					</Stack>
					<Divider style={{ marginBottom: "10px" }} />
					{isSoldItem ?
						<Box>
							{soldWaiting.length > 0 && renderSold("Odottaa lähetystä", soldWaiting)}
							{soldSent.length > 0 && renderSold("Lähetetty", soldSent)}
							{soldReceived.length > 0 && renderSold("Vastaanotettu", soldReceived)}
							{soldCancelled.length > 0 && renderSold("Peruutettu", soldCancelled)}
						</Box> 
						:
						<Box>
							{boughtSent.length > 0 && renderBought("Lähetetty", boughtSent)}
							{boughtWaiting.length > 0 && renderBought("Odottaa lähetystä", boughtWaiting)}
							{boughtReceived.length > 0 && renderBought("Vastaanotettu", boughtReceived)}
							{boughtCancelled.length > 0 && renderBought("Peruutettu", boughtCancelled)}

						</Box>}
				</Container>
			</Paper>
		</ThemeProvider>
	)
}