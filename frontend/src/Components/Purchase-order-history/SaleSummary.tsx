import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
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
		<Box>
			<Dialog
				open={isOpen}
				onClose={handleClose}
				sx={{
					"& .MuiDialog-container": {
						"& .MuiPaper-root": {
							width: "100%",
							maxWidth: "600px",  // Set your width here
						},
					},
				}}
			>				
				<Typography variant="h5" style={{textAlign: "center"}} mt={2} mb={2}>Tilausvahvistus</Typography>
				<DialogContent>
					<Typography sx={{fontSize: "1.2rem"}} pt={3} pb={2} pl={1}>Tarkista tilauksen tiedot.</Typography>
					<Typography sx={{fontSize: "1.1rem"}} pt={2} pb={3} pl={1}>Tilattavat tuotteet:</Typography> 
					{cart && cart.map((product: ProductType) =>
						<React.Fragment key={genUniqueId()}>
							<>
								<CheckoutProductCard 
									product={product} 
								/>
							</>
						</React.Fragment>
					)}
					<Box>
						<Typography p={3} sx={{fontSize: "1.1rem"}}>Yhteensä: {sum} €</Typography>
						<Divider style={{ marginBottom: "10px" }} />
						<Box p={2}>
							<Typography sx={{fontSize: "1.1rem"}} pt={2} pb={3}>Tilaajan tiedot:</Typography>
							<Typography>Nimi: {buyerInfo.buyer_name}</Typography>
							<Typography>Katuosoite: {buyerInfo.buyer_address}</Typography>
							<Typography>Kaupunki: {buyerInfo.buyer_city}</Typography>
							<Typography>Postinumero: {buyerInfo.buyer_postcode}</Typography>
							<Typography>Puhelinnumero: {buyerInfo.buyer_phone}</Typography>
							<Typography>Sähköposti: {buyerInfo.buyer_email}</Typography>
						</Box>
					</Box>

					<FormControl
						required
						error={error}
						component="fieldset"
						sx={{ m: 2 }}
						variant="standard"
					>
						{(buyerInfo.buyer_name === "" || buyerInfo.buyer_address === "" || buyerInfo.buyer_city === "" || buyerInfo.buyer_email === "" || buyerInfo.buyer_phone === "" || buyerInfo.buyer_postcode === "") ? (
							<Box>
								<Typography style={{color: "red"}}>Kaikki tiedot vaaditaan. Vaadittavia tietoja puuttuu.</Typography>
							</Box>
						):(
							<Stack direction="column">
								<FormGroup>
									<FormControlLabel
										control={
											<Checkbox checked={checked} onChange={handleChange} name="checked" />
										}
										label="Olen tarkistanut tiedot."
									/>
								</FormGroup>
								<FormHelperText>Tiedot on tarkistettava.</FormHelperText>
							</Stack>
						)
						}
					</FormControl>
				</DialogContent>
				<DialogActions style={{ margin: "25px", display: "flex", justifyContent: "space-between" }}>
					<Button variant="contained" onClick={() => {onClose(), setState({checked: false})}}>Muuta tietoja</Button>
					<Button variant="contained" color="success" disabled={!checked} onClick={() => handleNewSale()} autoFocus>
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
		</Box>
	)
}