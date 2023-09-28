import { useState, useEffect, useContext } from "react"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"
import Login from "./Login"
import "./LandingPage.css"
import { User, initialState } from "../types"
import { fetchUser } from "../services"
import { UserTokenContext } from "../App"


const LandingPage = () => {

	//const [isLoggedIn] = useState(true)
	const [token] = useContext(UserTokenContext)
	const [user, setUser] = useState<User>(initialState)
	
	
	const fetchUserDetails = async () => {
		if(!token){
			setUser(initialState)
			return
		}
		const user = await fetchUser(token)
	
		if (user === undefined) {
			console.error("error fetching user")
			return
		}
		setUser(user)
	}	
	useEffect(() => {
		fetchUserDetails()
	}, [token])

	return (
		<Box>
			<Container className="carousel-container">
				<div>
					<h1>Karuselli</h1>
				</div>
			</Container>
			<Box className="custom-container-one" display="flex">
				<Box className="custom-container-two">
					{user ? (
						<div>
							<h2>Tervetuloa käyttäjä x!</h2>
						</div>
					) : (
						<div>
							<h2> Onko sinulla jo käyttäjätunnus?</h2>
							<Button className="loginButton" variant="contained" color="primary"><Login /></Button>
						</div>
					)}
				</Box>
				<Box className="custom-container-two">
					{user ? (
						<div>
							<h2>Katso omat tuotteet</h2>
							<Button href='/' variant="contained" color="primary">
								Omat tuotteet
							</Button>
						</div>
					) : (
						<div>
							<h2> Liity joukkoomme!</h2>
							<Button href='/register' variant="contained" color="primary">
								Rekisteröidy
							</Button>
						</div>
					)}
				</Box>
			</Box>
		</Box>
	)
}

export default LandingPage


{/*<h2>{isLoggedIn ? "Tervetuloa käyttäjä x!": "Onko sinulla jo käyttäjätunnus?"}</h2>*/ }


/*const [token] = useContext(UserTokenContext)
	const [user, setUser] = useState<User>(initialState)
	
	
	const fetchUserDetails = async () => {
		if(!token){
			setUser(initialState)
			return
		}
	
	
		const user = await fetchUser(token)
	
	
		if (user === undefined) {
			console.error("error fetching user")
			return
		}
		   
		setUser(user)
	}
	
	
	useEffect(() => {
		fetchUserDetails()
	}, [token])
	*/