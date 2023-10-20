import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { useContext, useEffect, useState } from "react"
import { UserTokenContext } from "../App"
import { OrderDetailsProps, ProductType, Sale, User } from "../types"
import CheckoutProductCard from "./CheckoutSummaryProductCard"
import Notification from "./Notification"
import { cancelSale, fetchProduct, fetchSale, fetchSaleStatus, fetchUserDetailsByUserId, returnProductToShop, setSaleReceived, setSaleSent } from "../services"

export default function OrderDetails({ isSeller, isOpen, onClose, saleId }: OrderDetailsProps) {
	const [token] = useContext(UserTokenContext)
	const [showRelistErrorNotification, setShowRelistErrorNotification] = useState(false)
	const [showStatusErrorNotification, setShowStatusErrorNotification] = useState(false)
	const [sale, setSale] = useState<Sale>()
	const [seller, setSeller] = useState<User>()
	const [saleStatus, setSaleStatus] = useState("")
	const [product, setProduct] = useState<ProductType>()
	const [reload, setReload] = useState(false)

	useEffect(() => {
		const fetchSaleAndProduct = async () => {
			// Don't try to fetch without token or with initial saleId (0)
			if (!token || saleId === 0) return
			try {
				const fetchedSale: Sale = await fetchSale(token, saleId)
				const fetchedProduct: ProductType = await fetchProduct(fetchedSale.product_id)
				const fetchdSaleStatus: string = await fetchSaleStatus(fetchedSale.sales_status)
				if (!isSeller) {
					const fetchedSeller: User = await fetchUserDetailsByUserId(fetchedSale.seller_id)
					setSeller(fetchedSeller)
				}
				setSale(fetchedSale)
				setProduct(fetchedProduct)
				setSaleStatus(fetchdSaleStatus)
			} catch (error) {
				console.error("Error fetching order data: ", error)
			}		
		}
		fetchSaleAndProduct()
	}, [saleId, token, reload, isSeller])

	const handleSendProduct = async () => {
		try {
			await setSaleSent(saleId, token)
		} catch (error) {
			setShowStatusErrorNotification(true)
			console.error("Failed to update sales_status: ", error)
		}

		setReload(!reload)
	}

	const handleReceivedProduct = async () => {
		try {
			await setSaleReceived(saleId, token)
		} catch (error) {
			setShowStatusErrorNotification(true)
			console.error("Failed to update sales_status: ", error)
		}
		setReload(!reload)
	}

	const handleCancelSale = async () => {
		try {
			await cancelSale(saleId, token)
		} catch (error) {
			setShowStatusErrorNotification(true)
			console.error("Failed to update sales_status: ", error)
		}
		setReload(!reload)
	}

	const handleReturnToShop = async () => {
		try {
			if (sale?.product_id) {
				await returnProductToShop(sale?.product_id, token)
			}
		} catch (error) {
			setShowRelistErrorNotification(true)
			console.error("Failed to relist product: ", error)
		}
		setReload(!reload)
	}

	const renderBuyerDetails = () => {
		return (
			sale &&
			<>
				Nimi: {sale.buyer_name}<br />
				Puhelinnumero: {sale.buyer_phone}<br />
				Sähköposti: {sale.buyer_email}<br />
				Katuosoite: {sale.buyer_address}<br />
				Kaupunki: {sale.buyer_city}<br />
				Postinumero: {sale.buyer_postcode}<br />
				Tilauksen tila: {saleStatus}
				{saleStatus === "Peruutettu" && ", "}
				{saleStatus === "Peruutettu" && (
					<>
						{product?.listed ? "palautettu myyntiin" : "ei myynnissä"}
					</>
				)}
			</>
		)
	}

	const renderSellerDetails = () => {
		return (
			sale &&
			<>
				Käyttäjänimi: {seller?.username}<br />
				Kaupunki: {seller?.city}<br />
				Postinumero: {seller?.postal_code}<br />
				Tilauksen tila: {saleStatus}
			</>
		)
	}


	return (
		<>
			<Dialog
				open={isOpen}
				onClose={onClose}
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
						{isSeller ? "Tilaajan tiedot" : "Myyjän tiedot"}
					</DialogTitle>
					<DialogContentText id="alert-dialog-description">
						{isSeller ? renderBuyerDetails() : renderSellerDetails()}

					</DialogContentText>
				</DialogContent>
				<DialogActions>
					{isSeller ?
						<>
							{sale?.sales_status === 2 && <Button onClick={handleSendProduct}>Lähetetty</Button>}
							{sale?.sales_status === 2 && <Button onClick={handleCancelSale}>Peruuta tilaus</Button>}
							{(sale?.sales_status === 5 && product?.listed === false) && <Button onClick={handleReturnToShop}>Palauta myyntiin</Button>}
						</> :
						<>
							{sale?.sales_status === 3 && <Button onClick={handleReceivedProduct}>Vastaanotettu</Button>}
							{sale?.sales_status === 2 && <Button onClick={handleCancelSale}>Peruuta tilaus</Button>}
						</>}
					<Button onClick={onClose}>Sulje</Button>
				</DialogActions>
			</Dialog>
			{/* Success and error notifications */}
			{showRelistErrorNotification && (
				<Notification
					open={showRelistErrorNotification}
					message="Tuotteen palauttaminen myyntiin epäonnistui."
					type="error"
					onClose={() => setShowRelistErrorNotification(false)}
					duration={1500}
				/>
			)}
			{showStatusErrorNotification && (
				<Notification
					open={showStatusErrorNotification}
					message="Tilauksen päivittäminen epäonnistui."
					type="error"
					onClose={() => setShowStatusErrorNotification(false)}
					duration={1500}
				/>
			)}
		</>
	)
}