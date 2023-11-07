import * as React from "react"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Dialog, { DialogProps } from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import { ProductType, ShoppingCartProps } from "../../Services-types/types"
import { useEffect, useState } from "react"
import ShoppingCartProductCard from "../Product-cards/ShoppingCartProductCard"
import VerifyDialog from "../Verify-notification/VerifyDialog"
import { useNavigate } from "react-router-dom"
import { genUniqueId } from "../../Services-types/UniqueIDGenerator"

export default function ShoppingCart ({isOpen, onClose, cart, setCart}: ShoppingCartProps){
	const [scroll] = useState<DialogProps["scroll"]>("paper")
	const [verifyOpen, setVerifyOpen] = useState(false)
	const navigate = useNavigate()
	let sum = 0
	cart?.forEach((product) => {sum = sum + parseInt(product.price, 10)})
  
	const descriptionElementRef = React.useRef<HTMLElement>(null)
	useEffect(() => {
		if (isOpen) {
			const { current: descriptionElement } = descriptionElementRef
			if (descriptionElement !== null) {
				descriptionElement.focus()
			}
		}
		const storageItem = sessionStorage.getItem("myCart")
		if(storageItem !== null){
			setCart(JSON.parse(storageItem))
		} else {
			setCart(null)
		}
	}, [isOpen, setCart])

	const handleEmptyShoppingCart = () => {
		sessionStorage.clear()
		setCart(null)
	}

	const verifyDialogProps = {
		messageText: "Haluatko varmasti tyhjentää ostoskorin?",
		isOpen: verifyOpen,
		setOpen: setVerifyOpen,
		onAccept: handleEmptyShoppingCart
	}

	const handleVerification = () => {
		setVerifyOpen(true)
	}

	return (
		<Box>
			<Dialog
				sx={{
					"& .MuiDialog-container": {
						"& .MuiPaper-root": {
							width: "100%",
							maxWidth: "500px",  // Set your width here
						},
					},
				}}
				open={isOpen}
				onClose={onClose}
				scroll={scroll}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
				component="div"
			>
				<Typography variant="h5" style={{textAlign: "center"}} mt={2} id="scroll-dialog-title">Ostoskori</Typography>
				<DialogContent dividers={scroll === "paper"}>
					<DialogContentText
						component={"span"}
						id="scroll-dialog-description"
						ref={descriptionElementRef}
						tabIndex={-1}
					>
						{cart !== null ?
							cart.map((product: ProductType) =>
								<React.Fragment key={genUniqueId()}>
									<ShoppingCartProductCard 
										product={product} 
										onClose={onClose}
										setCart={setCart}	
									/>
								</React.Fragment>
							)
							: <Typography p={4}>Ostoskorissa ei vielä tuotteita. Kun lisäät tuotteita ostoskoriin, ne näkyvät tässä.</Typography>
						}
						<Typography variant="h6">Yhteensä: {sum} €</Typography>
					</DialogContentText>
				</DialogContent>
				{cart !== null ? (
					<DialogActions sx={{display: "flex", justifyContent: "space-between", margin: 2}}>
						<Button variant="contained" color={"error"} onClick={() => (handleVerification())}>Tyhjennä ostoskori</Button>
						<Button variant="contained" color={"success"} onClick={() => {navigate("/checkout"), onClose()}}>Kassalle</Button>
					</DialogActions>
				) : (<DialogActions>
					<Button onClick={onClose}>Sulje</Button>
				</DialogActions>)}
				<VerifyDialog {...verifyDialogProps} />
			</Dialog>
		</Box>
	)
}