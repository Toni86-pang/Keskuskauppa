import * as React from "react"
import Button from "@mui/material/Button"
import Dialog, { DialogProps } from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { ProductType, ShoppingCartProps } from "../types"
import ProductCard from "./ProductCard"

export default function ShoppingCart ({isOpen, onClose}: ShoppingCartProps){
	const [scroll] = React.useState<DialogProps["scroll"]>("paper")
  
	const descriptionElementRef = React.useRef<HTMLElement>(null)
	React.useEffect(() => {
		if (isOpen) {
			const { current: descriptionElement } = descriptionElementRef
			if (descriptionElement !== null) {
				descriptionElement.focus()
			}
		}
	}, [open])
  
	const cart = JSON.parse(sessionStorage.getItem("myCart"))

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
						{cart && cart.map((product: ProductType) => ProductCard({product}))}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Kassalle</Button>
					<Button onClick={onClose}>Peruuta</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
