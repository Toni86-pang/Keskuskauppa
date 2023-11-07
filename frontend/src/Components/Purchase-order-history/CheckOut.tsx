import { Container, Grid, Divider, Paper, TextField, Button, Typography } from "@mui/material"
import { useState, useEffect, ChangeEvent } from "react"
import { BuyerInfo, ProductType, User } from "../../Services-types/types"
import { fetchUser } from "../../Services-types/services"
import { useLoaderData, useNavigate, redirect } from "react-router-dom"
import CheckoutProductCard from "../Product-cards/CheckoutSummaryProductCard"
import SaleSummary from "./SaleSummary"
import { genUniqueId } from "../../Services-types/UniqueIDGenerator"
import React from "react"

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
	const token = localStorage.getItem("token")
	if(!token){
		return redirect("/")
	}
	else{
		const userData = await fetchUser(token)
		return userData
	}
}

export default function CheckOut() {
	const user = useLoaderData() as User
	const [newName, setNewName] = useState<string>(user.username)
	const [newAddress, setNewAddress] = useState<string>(user.address)
	const [newCity, setNewCity] = useState<string>(user.city)
	const [newPostCode, setNewPostCode] = useState<string>(user.postal_code)
	const [newPhone, setNewPhone] = useState<string>(user.phone)
	const [newEmail, setNewEmail] = useState<string>(user.email)
	const [cart, setCart] = useState<Array<ProductType> | null>(null)
	const [isSummaryOpen, setIsSummaryOpen] = useState(false)
	const navigate = useNavigate()
	const buyerInfo: BuyerInfo = {   
		buyer_id: user.user_id,
		buyer_name: newName,
		buyer_address: newAddress,
		buyer_city: newCity,
		buyer_postcode: newPostCode,
		buyer_phone: newPhone,
		buyer_email: newEmail,
	}  

	let sum = 0
	cart?.forEach((product) => {sum = sum +parseInt(product.price)})

	const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
		setNewName(event.target.value)
	}
    
	const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setNewAddress(value)
	}
	const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setNewCity(value)
	}
	const handlePostCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setNewPostCode(value)
	}
	const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setNewPhone(value)
	}
	const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setNewEmail(value)
	}

	useEffect(() => {
		setNewName(user.name)
		setNewAddress(user.address)
		setNewCity(user.city)
		setNewPostCode(user.postal_code)
		setNewPhone(user.phone)
		setNewEmail(user.email)

		const storageItem = sessionStorage.getItem("myCart")
		if(storageItem !== null){
			setCart(JSON.parse(storageItem))
		} else {
			setCart(null)
		}
	}, [setCart])
  
	const handleClickOpen = () => {
		setIsSummaryOpen(true)
	}
  
	const handleClose = () => {
		setIsSummaryOpen(false)
	}
    
	return(
		<Paper sx={{
			backgroundColor: "#f3f6fa",
			elevation: 5,
			p: 2
		}}>
			<Typography variant="h5" style={{textAlign: "center"}} p={2}>Lähetystiedot ja yhteenveto</Typography>
			<Typography sx={{fontSize: "1.2rem"}} pl={5} pt={2} pb={1}>Ostoskorin sisältö</Typography>
			{cart !== null ? (
				<Container sx={{ m: 1 }}>
					{cart && cart.map((product: ProductType) =>
						<React.Fragment key={genUniqueId()}>
							<>
								<CheckoutProductCard 
									product={product} 
									setCart={setCart}	
								/>
							</>
						</React.Fragment>
					)}
					<Typography p={2} sx={{fontSize: "1.2rem"}} pt={2}>Yhteensä: {sum} €</Typography>
					<Divider style={{ marginBottom: "10px" }} />
					<Typography sx={{fontSize: "1.2rem"}} pt={2} pb={2}>Vastaanottajan tiedot</Typography>
					<Grid container direction="row" spacing={2} justifyContent="flex-start" alignItems="center" pb={2}>
						<Grid item xs={6} pr={3}>
							<Typography pt={2} pb={1} required style={{position: "relative"}} id="description">Nimi</Typography>
							<TextField
								required
								type="text"
								name="name"
								value={newName}
								onChange={handleNameChange}
								fullWidth
							/>
							<Typography pt={2} pb={1} required style={{position: "relative"}} id="description">Katuosoite</Typography>
							<TextField
								required
								type="text"
								name="address"
								value={newAddress}
								onChange={handleAddressChange}
								fullWidth
							/>
							<Typography pt={2} pb={1} required style={{position: "relative"}} id="price">Postinumero</Typography>
							<TextField
								required
								type="text"
								name="postcode"
								value={newPostCode}
								onChange={handlePostCodeChange}
								fullWidth
							/>
						</Grid>
						<Grid item xs={6} >
							<Typography pt={2} pb={1} required style={{position: "relative"}} id="price">Kaupunki</Typography>
							<TextField
								required
								type="text"
								name="city"
								value={newCity}
								onChange={handleCityChange}
								fullWidth
							/>
							<Typography pt={2} pb={1} required style={{position: "relative"}} id="price">Puhelinnumero</Typography>
							<TextField
								required
								type="text"
								name="phone"
								value={newPhone}
								onChange={handlePhoneChange}
								fullWidth
							/>
							<Typography pt={2} pb={1} required style={{position: "relative"}} id="price">Sähköposti</Typography>
							<TextField
								required
								type="text"
								name="email"
								value={newEmail}
								onChange={handleEmailChange}
								fullWidth
							/>
						</Grid>
					</Grid>
					<Grid container direction="row" spacing={2} justifyContent="flex-end" alignItems="center" pt={3}>
						<Button 
							sx={{
								m: 1,
							}}
							variant="contained"
							onClick={() => navigate("/")}>
							Peruuta
						</Button>
						<Button
							color="success"
							variant="contained"
							onClick={handleClickOpen}>
							Tilausvahvistukseen
						</Button>
						<SaleSummary  
							isOpen={isSummaryOpen}
							onClose={handleClose} 
							buyerInfo={buyerInfo}
							sum={sum}
							cart={cart} />
					</Grid>
				</Container>
			):(<Typography p={2}>Ostoskorisi on tyhjä.</Typography>)}
		</Paper>
	)
}
