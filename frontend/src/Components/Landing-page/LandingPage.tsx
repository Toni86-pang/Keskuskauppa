import { useState, useEffect, useContext } from "react"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Button from "@mui/material/Button"
import Login from "../Register-login/Login"
import "./LandingPage.css"
import { User } from "../../Services-types/types"
import { fetchUser } from "../../Services-types/services"
import { UserTokenContext } from "../../App"
import CustomCarousel from "./Carousel/Carousel"
import RegisterNewUser from "../Register-login/RegisterNewUser"

const LandingPage = () => {
	const [token] = useContext(UserTokenContext)
	const [user, setUser] = useState<User | null>(null)
	const isLoggedIn = Boolean(user)

	useEffect(() => {
		const fetchUserDetails = async () => {
			if (!token) {
				setUser(null)
				return
			}
			const user = await fetchUser(token)

			if (!user) {
				console.error("error fetching user")
				return
			}
			setUser(user)
		}
		fetchUserDetails()
	}, [token])

	return (
		<Box>
			<Container className="custom-carousel">
				<CustomCarousel />
			</Container>
			<Box className="custom-container-one" display="flex">
				<Box className="custom-container-two">
					{isLoggedIn ? (
						<div>
							<h2>Tervetuloa {user?.username}!</h2>
						</div>
					) : (
						<div>
							<h2> Onko sinulla jo käyttäjätunnus?</h2>
							<div className="loginButton">
								<Login />
							</div>
						</div>
					)}
				</Box>
				<Box className="custom-container-two">
					{isLoggedIn ? (
						<div>
							<h2>Selaa tuotteita</h2>
							<Button href='/products' variant="contained" color="primary">
								Kaikki tuotteet
							</Button>
						</div>
					) : (
						<div>
							<h2> Liity joukkoomme!</h2>
							<div className="loginButton">
								<RegisterNewUser />
							</div>
						</div>
					)}
				</Box>
			</Box>
		</Box>
	)
}

export default LandingPage