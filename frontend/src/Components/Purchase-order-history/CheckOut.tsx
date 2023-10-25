import { Container, InputLabel, TextField, Button } from "@mui/material"
import { useState, useEffect, ChangeEvent } from "react"
import { BuyerInfo, ProductType, User } from "../../Services-types/types"
import { fetchUser } from "../../Services-types/services"
import { useLoaderData, useNavigate, redirect } from "react-router-dom"
import CheckoutProductCard from "../Product-cards/CheckoutSummaryProductCard"
import SaleSummary from "./SaleSummary"

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
		<>
			{cart !== null ? (
				<Container sx={{ m: 1 }}>
					{cart && cart.map((product: ProductType) =>
						<>
							<CheckoutProductCard 
								product={product} 
								key={product.product_id}
								setCart={setCart}	
							/>
						</>)}
					<h3>Summa: {sum} €</h3>
					<h3>Vastaanottajan tiedot</h3>
					<InputLabel required style={{position: "relative"}} sx={{ mb: 2 }} id="description">Nimi</InputLabel>
					<TextField
						required
						type="text"
						name="name"
						value={newName}
						onChange={handleNameChange}
						fullWidth
					/>
					<InputLabel required style={{position: "relative"}} sx={{ mb: 2 }} id="description">Katuosoite</InputLabel>
					<TextField
						required
						type="text"
						name="address"
						value={newAddress}
						onChange={handleAddressChange}
						fullWidth
					/>
					<InputLabel required style={{position: "relative"}} sx={{ mb: 2 }} id="price">Kaupunki</InputLabel>
					<TextField
						required
						type="text"
						name="city"
						value={newCity}
						onChange={handleCityChange}
						fullWidth
					/>
					<InputLabel required style={{position: "relative"}} sx={{ mb: 2 }} id="price">Postinumero</InputLabel>
					<TextField
						required
						type="text"
						name="postcode"
						value={newPostCode}
						onChange={handlePostCodeChange}
						fullWidth
					/>
					<InputLabel required style={{position: "relative"}} sx={{ mb: 2 }} id="price">Puhelinnumero</InputLabel>
					<TextField
						required
						type="text"
						name="phone"
						value={newPhone}
						onChange={handlePhoneChange}
						fullWidth
					/>
					<InputLabel required style={{position: "relative"}} sx={{ mb: 2 }} id="price">Sähköposti</InputLabel>
					<TextField
						required
						type="text"
						name="email"
						value={newEmail}
						onChange={handleEmailChange}
						fullWidth
					/>
					<Button
						sx={{
							m: 1,
							bgcolor: "#6096ba",
							":hover": { bgcolor: "darkblue" }
						}}
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
					<Button 
						sx={{
							m: 1,
							bgcolor: "#6096ba",
							":hover": { bgcolor: "#d32f2f" },
						}}
						variant="contained"
						onClick={() => navigate("/")}>
							Peruuta
					</Button>
				</Container>
			):(<p>Ostoskorisi on tyhjä.</p>)}
		</>
	)
}
