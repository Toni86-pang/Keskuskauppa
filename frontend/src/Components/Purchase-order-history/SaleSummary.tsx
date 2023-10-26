import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import React, { useContext, useState } from "react"
import { CartContextType, UserTokenContext } from "../../App"
import { newSale } from "../../Services-types/services"
import { useNavigate, useOutletContext } from "react-router"
import { ProductType, Sale, SummaryProps } from "../../Services-types/types"
import CheckoutProductCard from "../Product-cards/CheckoutSummaryProductCard"
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, Stack } from "@mui/material"
import Notification from "../Verify-notification/Notification"
import { genUniqueId } from "../../Services-types/UniqueIDGenerator"

export default function SaleSummary (props: SummaryProps) {
	const { onClose, isOpen, buyerInfo, sum, cart } = props
	const [token] = useContext(UserTokenContext)
	const [showSuccessNotification, setShowSuccessNotification] = useState(false)
	const [showErrorNotification, setShowErrorNotification] = useState(false)
	const [state, setState] = useState({ checked: false })
	const [ setCart ] = useOutletContext<CartContextType>()
	const navigate = useNavigate()
   
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setState({
			...state,
			[event.target.name]: event.target.checked,
		})
	}
    
	const handleNewSale = async () => {
		if(!cart) return
		cart?.map(async product => {
			const sale: Sale = {   
				product_id: product.product_id,
				buyer_id: buyerInfo.buyer_id,
				buyer_name: buyerInfo.buyer_name,
				buyer_address: buyerInfo.buyer_address,
				buyer_city: buyerInfo.buyer_city,
				buyer_postcode: buyerInfo.buyer_postcode,
				buyer_phone: buyerInfo.buyer_phone,
				buyer_email: buyerInfo.buyer_email,
				seller_id: product.user_id,
				sales_status: 2
			} 
			const makingSale = await newSale(sale, token)
			if(makingSale === undefined){
				console.log("Error creating a new sale")
				setShowErrorNotification(true) // Show error notification
			} else {
				emptyShoppingCart()
				setShowSuccessNotification(true) // Show success notification
				await timeout(1500)
				navigate("/")
			}
		})
	}

	function timeout(delay: number) {
		return new Promise( res => setTimeout(res, delay) )
	}

	const handleClose = () => {
		onClose()
	}

	const { checked } = state
	const error = [checked].filter((v) => v).length !== 1

	const emptyShoppingCart = () => {
		sessionStorage.clear()
		setCart(null)
	}
  
	return (
		<>
			<Dialog
				open={isOpen}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title" component={"span"}>
					<h3>Tilausvahvistus</h3>
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description" component={"span"}>
                        Tarkista tilauksen tiedot.
						<h4>Tilattavat tuotteet:</h4> {cart && cart.map((product: ProductType) =>
							<React.Fragment key={genUniqueId()}>
								<>
									<CheckoutProductCard 
										product={product} 
									/>
								</>
							</React.Fragment>
						)}
						<div>
							<h4>Summa: {sum} €</h4>
							<h4>Tilaajan tiedot:</h4>
							Nimi: {buyerInfo.buyer_name}<br/>
							Katuosoite: {buyerInfo.buyer_address}<br/>
							Kaupunki: {buyerInfo.buyer_city}<br/>
							Postinumero: {buyerInfo.buyer_postcode}<br/>
							Puhelinnumero: {buyerInfo.buyer_phone}<br/>
							Sähköposti: {buyerInfo.buyer_email}<br/>
						</div>

						<FormControl
							required
							error={error}
							component="fieldset"
							sx={{ m: 3 }}
							variant="standard"
						>
							{(buyerInfo.buyer_name === "" || buyerInfo.buyer_address === "" || buyerInfo.buyer_city === "" || buyerInfo.buyer_email === "" || buyerInfo.buyer_phone === "" || buyerInfo.buyer_postcode === "") ? (
								<div>
									<h5 style={{color: "red"}}>Kaikki tiedot vaaditaan. Vaadittavia tietoja puuttuu.</h5>
								</div>
							):(
								<Stack direction="row">
									<FormGroup>
										<FormControlLabel
											control={
												<Checkbox checked={checked} onChange={handleChange} name="checked" />
											}
											label="Olen tarkistanut tiedot."
										/>
									</FormGroup>
									<FormHelperText>Tietojen tarkistus on varmistettava.</FormHelperText>
								</Stack>
							)
							}
						</FormControl>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => {onClose(), setState({checked: false})}}>Muuta tietoja</Button>
					<Button disabled={!checked} onClick={() => handleNewSale()} autoFocus>
                        Tilaa ja maksa
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