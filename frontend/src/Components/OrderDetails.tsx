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
import { cancelSale, fetchProduct, fetchSale, fetchSaleStatus, setSaleSent } from "../services"

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
	const [reload, setReload] = useState(false)

	useEffect(() => {
		const fetchSaleAndProduct = async () => {
			if (!token) return
			const fetchedSale = await fetchSale(token, saleId)
			const fetchedProduct = await fetchProduct(fetchedSale.product_id)
			const fetchdSaleStatus = await fetchSaleStatus(fetchedSale.sales_status)
			setSale(fetchedSale)
			setProduct(fetchedProduct)
			setSaleStatus(fetchdSaleStatus)
		}
		fetchSaleAndProduct()
	}, [saleId, token, reload])

	const handleClose = () => {
		onClose()
	}

	const handleSendProduct = async () => {
		try {
			await setSaleSent(saleId, token)
		}catch (error) {
			console.error("Failed to update sales_status: ", error)
		}
		
		setReload(!reload)
	}

	const handleCancelSale = async () => {
		try {
			await cancelSale(saleId, token)
		}catch (error) {
			console.error("Failed to update sales_status: ", error)
		}
		
		setReload(!reload)
	}

	return (
		<>
			<Dialog
				open={isOpen}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle variant="h4" id="alert-dialog-title">
					Tilauksen tiedot
				</DialogTitle>
				<DialogContent>
					{product && <CheckoutProductCard
						product={product}
						key={product.product_id + product.title}
					/>}					
					
					<DialogTitle variant="h5">
						Tilaajan tiedot
					</DialogTitle>
					<DialogContentText id="alert-dialog-description">
						{sale && <>
							Nimi: {sale.buyer_name}<br />
							Puhelinnumero: {sale.buyer_phone}<br />
							Sähköposti: {sale.buyer_email}<br />
							Katuosoite: {sale.buyer_address}<br />
							Kaupunki: {sale.buyer_city}<br />
							Postinumero: {sale.buyer_postcode}<br />
							Tilauksen tila: {saleStatus !== undefined && saleStatus }
						</>}

					</DialogContentText>
				</DialogContent>
				<DialogActions>
					{sale?.sales_status === 2 && <Button onClick={ handleSendProduct }>Lähetetty</Button>}
					{sale?.sales_status === 2 && <Button onClick={ handleCancelSale }>Peruuta tilaus</Button>}
					{sale?.sales_status === 5 && <Button >Palauta myyntiin</Button>}
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