import { useState, useContext, useEffect } from "react"
import { Link, useNavigate} from "react-router-dom"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	Menu,
	IconButton,
	MenuItem,
} from "@mui/material"
import CategoryMenu from "./CategoryMenu"
import Login from "./Login"
import RegisterNewUser from "./RegisterNewUser"
import { UserTokenContext } from "../App"
import { fetchUser } from "../services"
import { User } from "../types"
import ProductSearch from "./Searchbar"


const Navbar = () => {
	const [token, setToken] = useContext(UserTokenContext)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [user, setUser] = useState<User | null>(null)
	const navigate = useNavigate()

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleMenuClose = () => {
		setAnchorEl(null)
	}

	const handleLogout = () => {
		// Clear the token, reset the user state, and user's name
		localStorage.removeItem("token")
		setToken("")
		setUser(null) // Reset the user object
		handleMenuClose()
		navigate("/")
	}

	useEffect(() => {
		// Fetch the user's information when the component mounts
		if (token) {
			fetchUser(token) // Use the fetchUser API call from your services
				.then((fetchedUser) => {
					if (fetchedUser) {
						setUser(fetchedUser)
					} else {
						console.error("Error fetching user")
					}
				})
				.catch((error) => {
					console.error("Error fetching user:", error)
				})
		}
	}, [token])
	
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={{ bgcolor: "#6096ba" }}>
				<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
					{/* Left side (store name and category menu) */}
					<CategoryMenu />
					<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
						<Typography variant="h6">
							Keskuskauppa
						</Typography>
					</Link>
				
					{/* Middle (search bar) */}
						
					<ProductSearch />
						
					{/* Right side (user-related elements) */}
					<div>
						{token ? (
							<>
								<IconButton
									onClick={handleMenuOpen}
									color="inherit"
									aria-controls="user-menu"
									aria-haspopup="true"
								>
									<AccountCircleIcon />
									<Typography variant="body1" sx={{ mt: 1 }}>
										{user?.name} {/* Access the user's name */}
									</Typography>
									<ArrowDropDownIcon />
									<ShoppingCartIcon />
								</IconButton>
								<Menu
									id="user-menu"
									anchorEl={anchorEl}
									open={Boolean(anchorEl)}
									onClose={handleMenuClose}
								>
									<MenuItem
										onClick={handleMenuClose}
										component={Link} to="/profile"
									>
										Profiili
									</MenuItem>
									<MenuItem
										onClick={handleMenuClose}
										component={Link}
										to="/product/new"
									>
										Lisää uusi tuote
									</MenuItem>
									<MenuItem
										onClick={handleMenuClose}
										component={Link}
										to="/products"
									>
										Tuotteet
									</MenuItem>
									<MenuItem onClick={handleLogout}>Kirjaudu ulos</MenuItem>
								</Menu>
							</>
						) : (
							<>
								<RegisterNewUser />
								<Login />
							</>
						)}
					</div>
				</Toolbar>
			</AppBar>
		</Box>
	)
}
export default Navbar