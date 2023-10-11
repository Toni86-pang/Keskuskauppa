import * as React from "react"
import Button from "@mui/material/Button"
import Dialog, { DialogProps } from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { ProductType, ShoppingCartProps } from "../types"
import { useEffect, useState } from "react"
import SalesProductCard from "./SalesProductCard"
// import { Grid } from "@mui/material"
import { useNavigate } from "react-router"
import VerifyDialog from "./VerifyDialog"

export default function ShoppingCart ({isOpen, onClose}: ShoppingCartProps){
	const [scroll] = useState<DialogProps["scroll"]>("paper")
	const [cart, setCart] = useState<Array<ProductType> | null>(null)
	const [verifyOpen, setVerifyOpen] = useState(false)
	const navigate = useNavigate()
	let sum = 0
	cart?.forEach((product) => {sum = sum +product.price})
  
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
	}, [isOpen])

	const handleEmptyShoppingCart = () => {
		sessionStorage.clear()
		setCart(null)
	}

	const handleRemoveFromCart = (product_id: ProductType) => {
		const storageItem = sessionStorage.getItem("myCart")
		const tempCart: ProductType[] = storageItem !== null ? JSON.parse(storageItem) : []
		const filteredCart: ProductType[] = tempCart.filter(function (cartProduct) {return cartProduct.product_id !== product_id})
		sessionStorage.clear()
		if(filteredCart.length > 0){
			setCart(filteredCart)
			sessionStorage.setItem("myCart", JSON.stringify(filteredCart))
		} else {
			setCart(null)
		}
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
						{cart !== null
							? cart.map((product: ProductType) =>
								<>
									<SalesProductCard product={product} key={product.product_id + product.title} />
									<>
										<Button variant="contained" color="primary" onClick={() => {
											navigate(`/product/${product.product_id}`)
											onClose()
										}}>
											Katso tuote
										</Button>
									</>
									<>
										<Button variant="contained" color="primary" onClick={() => {
											handleRemoveFromCart(product.product_id)
										}}>
											Poista ostoskorista
										</Button>
									</></>)
							: <>Ostoskorissa ei vielä tuotteita. Kun lisäät tuotteita ostoskoriin, ne näkyvät tässä.</>
						}
						<p>Summa: {sum} €</p>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Kassalle</Button>
					<Button onClick={() => (handleVerification())}>Tyhjennä ostoskori</Button>
					<Button onClick={onClose}>Sulje</Button>
				</DialogActions>
				<VerifyDialog {...verifyDialogProps} />
			</Dialog>
		</div>
	)
}