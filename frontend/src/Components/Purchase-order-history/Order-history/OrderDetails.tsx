import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import { useContext, useEffect, useState } from "react"
import { UserTokenContext } from "../../../App"
import { OrderDetailsProps, ProductType, Sale, User } from "../../../Services-types/types"
import CheckoutProductCard from "../../Product-cards/CheckoutSummaryProductCard"
import Notification from "../../Verify-notification/Notification"
import { cancelSale, fetchProduct, fetchSale, fetchSaleStatus, fetchUserDetailsByUserId, returnProductToShop, setSaleReceived, setSaleSent } from "../../../Services-types/services"
import LeaveReview from "./LeaveReview"
import { useNavigate } from "react-router"

export default function OrderDetails({ isSeller, isOpen, onClose, saleId }: OrderDetailsProps) {
	const [token] = useContext(UserTokenContext)
	const [showRelistErrorNotification, setShowRelistErrorNotification] = useState(false)
	const [showStatusErrorNotification, setShowStatusErrorNotification] = useState(false)
	const [sale, setSale] = useState<Sale>()
	const [seller, setSeller] = useState<User>()
	const [saleStatus, setSaleStatus] = useState("")
	const [product, setProduct] = useState<ProductType>()
	const [reload, setReload] = useState(false)
	const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
	const navigate = useNavigate()


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
	}, [saleId, token, reload, isSeller, sale?.sales_status, sale?.reviewed])

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
			<Box>
				<Typography>Nimi: {sale.buyer_name}</Typography>
				<Typography>Puhelinnumero: {sale.buyer_phone}</Typography>
				<Typography>Sähköposti: {sale.buyer_email}</Typography>
				<Typography>Katuosoite: {sale.buyer_address}</Typography>
				<Typography>Kaupunki: {sale.buyer_city}</Typography>
				<Typography>Postinumero: {sale.buyer_postcode}</Typography>
				<Typography>Tilauksen tila: {saleStatus}</Typography>
				{saleStatus === "Peruutettu" && (
					<Typography>
						{product?.listed ? "Palautettu myyntiin" : "Ei myynnissä"}
					</Typography>
				)}
			</Box>
		)
	}
	
	const handleClick = () => {
		navigate(`/user/${seller?.user_id}`)
	}

	const renderSellerDetails = () => {
		return (
			sale && sale.reviewed ? (
				<Box>
					<Typography>Käyttäjänimi: <Button onClick={handleClick}>{seller?.username}</Button></Typography>
					<Typography>Kaupunki: {seller?.city}</Typography>
					<Typography>Postinumero: {seller?.postal_code}</Typography>
					<Typography>Tilauksen tila: {saleStatus}</Typography>
					<Typography>Arvosteltu: Kyllä</Typography>
				</Box>
			):(
				<Box>
					<Typography>Käyttäjänimi: <Button onClick={handleClick}>{seller?.username}</Button></Typography>
					<Typography>Kaupunki: {seller?.city}</Typography>
					<Typography>Postinumero: {seller?.postal_code}</Typography>
					<Typography>Tilauksen tila: {saleStatus}</Typography>
					<Typography>Arvosteltu: Voit arvostella tuotteen vastaanotettuasi sen.</Typography>
				</Box>
			)
		)
	}

	const styles = {
		section: {
			marginTop: "16px",
		},
		label: {
			marginBottom: "8px",
		},
		buttonContainer: {
			marginTop: "15px",
			display: "flex",
			justifyContent: "space-between",
		},
	}

	return (
		<Box>
			<Dialog
				open={isOpen}
				onClose={onClose}
				sx={{
					"& .MuiDialog-container": {
						"& .MuiPaper-root": {
							width: "100%",
							maxWidth: "500px",  // Set your width here
						},
					},
				}}
			>
				<Typography variant="h5" style={{textAlign: "center"}} p={2}>Tilauksen tiedot</Typography>
				<DialogContent>
					<Typography sx={{fontSize: "1.2rem"}} p={1}>Tilauttu tuote:</Typography>
					{product && <CheckoutProductCard
						product={product}
						key={product.product_id + product.title}
					/>}

					<Typography sx={{fontSize: "1.2rem"}} p={1}>
						{isSeller ? "Tilaajan tiedot:" : "Myyjän tiedot:"}
					</Typography>
					<Box pl={6}>
						{isSeller ? renderBuyerDetails() : renderSellerDetails()}
					</Box>
					{isSeller ?
						<DialogActions style={styles.buttonContainer}>
							{sale?.sales_status === 2 && <Button variant="contained" color="error" onClick={handleCancelSale}>Peruuta tilaus</Button>}
							{sale?.sales_status === 2 && <Button variant="contained" color="success" onClick={handleSendProduct}>Lähetetty</Button>}
							{(sale?.sales_status === 5 && product?.listed === false) && <Button variant="contained" color="success" onClick={handleReturnToShop}>Palauta myyntiin</Button>}
						</DialogActions> 
						:
						<DialogActions style={styles.buttonContainer}>
							{sale?.sales_status === 3 && <Button variant="contained" color="success" onClick={() => {handleReceivedProduct()}}>Vastaanotettu</Button>}
							{((sale?.reviewed === false && sale?.sales_status === 4) && !sale.reviewed) && <Button variant="contained" onClick={() => {setIsReviewModalOpen(true)}}>Jätä arvostelu</Button>}
							<LeaveReview
								isOpen={isReviewModalOpen}
								onClose={() => setIsReviewModalOpen(false)}
								token={token}
								sale_id={saleId}
								seller_id={sale?.seller_id}
								sale={sale}
							/>
							{sale?.sales_status === 2 && <Button variant="contained" color="error" onClick={handleCancelSale}>Peruuta tilaus</Button>}
						</DialogActions> 
					}
				</DialogContent>
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
		</Box>
	)
}