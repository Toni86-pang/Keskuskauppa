import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { useContext, useEffect, useState } from "react"
import { UserTokenContext } from "../App"
import { ProductType, Sale } from "../types"
import CheckoutProductCard from "./CheckoutSummaryProductCard"
import Notification from "./Notification"
import { fetchProduct, fetchSale, fetchSaleStatus } from "../services"

interface OrderDetailsProps {
	saleId: number
	isOpen: boolean
	onClose: () => void
}

export default function OrderDetails(props: OrderDetailsProps) {
	const { saleId, onClose, isOpen } = props
	const [token] = useContext(UserTokenContext)
	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)
	const [sale, setSale] = useState<Sale>()
	const [saleStatus, setSaleStatus] = useState("")
	const [product, setProduct] = useState<ProductType>()

	useEffect(() => {
		const fetchSaleAndProduct = async () => {
			const fetchedSale = await fetchSale(token, saleId)
			const fetchedProduct = await fetchProduct(fetchedSale.product_id)
			const fetchdSaleStatus = await fetchSaleStatus(fetchedSale.sales_status)
			setSale(fetchedSale)
			setProduct(fetchedProduct)
			setSaleStatus(fetchdSaleStatus)
		}
		fetchSaleAndProduct()
	}, [saleId, token])

	const handleClose = () => {
		onClose()
	}

	return (
		<>
			<Dialog
				open={isOpen}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					<h3>Tilauksen tiedot</h3>
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						{product && <CheckoutProductCard
							product={product}
							key={product.product_id + product.title}
						/>}
						<h4>Tilaajan tiedot:</h4>
						{sale && <>
							Nimi: {sale.buyer_name}<br />
							Puhelinnumero: {sale.buyer_phone}<br />
							Sähköposti: {sale.buyer_email}<br />
							Katuosoite: {sale.buyer_address}<br />
							Kaupunki: {sale.buyer_city}<br />
							Postinumero: {sale.buyer_postcode}
						</>}

					</DialogContentText>
				</DialogContent>
				<DialogActions>
					{sale?.sales_status===2&&<Button onClick={onClose}>Lähetetty</Button>}
					<Button >
						Peruuta tilaus
					</Button>
				</DialogActions>
			</Dialog>
			{/* Success and error notifications */}
			{showSuccessNotification && (
				<Notification
					open={showSuccessNotification}
					message="Tilaus onnistui!"
					type="success"
					onClose={() => setShowSuccessNotification(false)}
					duration={1500}
				/>
			)}
			{showErrorNotification && (
				<Notification
					open={showErrorNotification}
					message="Tilaus epäonnistui."
					type="error"
					onClose={() => setShowErrorNotification(false)}
					duration={1500}
				/>
			)}
		</>
	)
}