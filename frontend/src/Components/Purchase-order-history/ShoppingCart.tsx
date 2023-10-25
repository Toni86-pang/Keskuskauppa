import * as React from "react"
import Button from "@mui/material/Button"
import Dialog, { DialogProps } from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { ProductType, ShoppingCartProps } from "../../Services-types/types"
import { useEffect, useState } from "react"
import SalesProductCard from "../Product-cards/SalesProductCard"
import VerifyDialog from "../Verify-notification/VerifyDialog"
import { useNavigate } from "react-router-dom"

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

	function genUniqueId(): string {
		const dateStr = Date
			.now()
			.toString(36) // convert num to base 36 and stringify
	
		const randomStr = Math
			.random()
			.toString(36)
			.substring(2, 8) // start at index 2 to skip decimal point
	
		return `${dateStr}-${randomStr}`
	}

	return (
		<div>
			<Dialog
				open={isOpen}
				onClose={onClose}
				scroll={scroll}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle id="scroll-dialog-title">Ostoskori</DialogTitle>
				<DialogContent dividers={scroll === "paper"}>
					<DialogContentText
						id="scroll-dialog-description"
						ref={descriptionElementRef}
						tabIndex={-1}
					>
						{cart !== null ?
							cart.map((product: ProductType) =>
								<>
									<SalesProductCard 
										product={product} 
										key={genUniqueId()} 
										onClose={onClose}
										setCart={setCart}	
									/>
								</>)
							: <>Ostoskorissa ei vielä tuotteita. Kun lisäät tuotteita ostoskoriin, ne näkyvät tässä.</>
						}
						<p>Summa: {sum} €</p>
					</DialogContentText>
				</DialogContent>
				{cart !== null ? (
					<DialogActions>
						<Button onClick={() => (handleVerification())}>Tyhjennä ostoskori</Button>
						<Button onClick={() => {navigate("/checkout"), onClose()}}>Kassalle</Button>
						<Button onClick={onClose}>Sulje</Button>
					</DialogActions>
				) : (<DialogActions>
					<Button onClick={onClose}>Sulje</Button>
				</DialogActions>)}
				<VerifyDialog {...verifyDialogProps} />
			</Dialog>
		</div>
	)
}