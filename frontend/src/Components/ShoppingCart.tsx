import * as React from "react"
import Button from "@mui/material/Button"
import Dialog, { DialogProps } from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { ProductType, ShoppingCartProps } from "../types"
import ProductCard from "./ProductCard"
import { useEffect, useState } from "react"

export default function ShoppingCart ({isOpen, onClose}: ShoppingCartProps){
	const [scroll] = useState<DialogProps["scroll"]>("paper")
	const storageItem = sessionStorage.getItem("myCart") ?? "[]"
	const cart = JSON.parse(storageItem)
  
	const descriptionElementRef = React.useRef<HTMLElement>(null)
	useEffect(() => {
		if (isOpen) {
			const { current: descriptionElement } = descriptionElementRef
			if (descriptionElement !== null) {
				descriptionElement.focus()
			}
		}
	}, [isOpen])

	useEffect(() => {
		const mapCart = () => {
			return cart.map((product: ProductType) => ProductCard({product}))
		}
		mapCart()
	}, [cart])
  
	const handleEmptyShoppingCart = () => {
		sessionStorage.clear()
		cart.splice(0, cart.length)	
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
						{cart.length > 0 ? (
							cart.map((product: ProductType) => ProductCard({product}))
						)
							:
							(
								<p>Ostoskorissa ei vielä tuotteita. Kun lisäät tuotteita ostoskoriin, ne näkyvät tässä.</p>
							)
						
						}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Kassalle</Button>
					<Button onClick={() => (handleEmptyShoppingCart())}>Tyhjennä ostoskori</Button>
					<Button onClick={onClose}>Sulje</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
