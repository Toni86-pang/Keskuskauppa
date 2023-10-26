import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import {
	AppBar,
	// Box,
	Toolbar,
	Typography,
	Menu,
	IconButton,
	MenuItem,
	Badge,
} from "@mui/material"
import CategoryMenu from "../Product-related/CategoryMenu"
import Login from "../Register-login/Login"
import RegisterNewUser from "../Register-login/RegisterNewUser"
import { UserTokenContext } from "../../App"
import { fetchOwnBought, fetchOwnSold, fetchUser } from "../../Services-types/services"
import { BoughtProps, NavbarProps, SoldProps, User } from "../../Services-types/types"
import ShoppingCart from "../Purchase-order-history/ShoppingCart"
import "./Navbar.css"
import Crumbs from "../Crumbs/Crumbs"
import ProductSearch from "../Search/Searchbar"


const Navbar = ({ cart, setCart }: NavbarProps) => {
	const [token, setToken] = useContext(UserTokenContext)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [user, setUser] = useState<User | null>(null)
	const [isShoppingCartOpen, setShoppingCartOpen] = useState(false)
	const navigate = useNavigate()
	const [unSent, setUnsent] = useState(0)
	const [notReceived, setNotReceived] = useState(0)
	const [inSales, setInSales] = useState(true)

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
		sessionStorage.clear()
		setCart(null)
		navigate("/")
	}

	useEffect(() => {
		const fetchUserData = async () => {
			if (token) {
				try {
					const fetchedUser = await fetchUser(token) // Use the fetchUser API call from your services
					if (fetchedUser) {
						setUser(fetchedUser)
					} else {
						console.error("Error fetching user")
					}
				} catch (error) {
					console.error("Error fetching user:", error)
				}
			}
		}

		fetchUserData()
	}, [token])

	useEffect(() => {
		const getSalesNeedingAttention = async () => {
			if (!token) return
			try {
				const sold: SoldProps[] = await fetchOwnSold(token)
				const needSending = sold.filter((sale) => sale.sales_status === "Odottaa lähetystä").length
				setUnsent(needSending)

				const bought: BoughtProps[] = await fetchOwnBought(token)
				const waitingReceiving = bought.filter((sale) => sale.sales_status === "Lähetetty").length
				setNotReceived(waitingReceiving)
			} catch (error) {
				console.error("Failed to get sales for notification badge: ", error)
			}

		}
		getSalesNeedingAttention()

	}, [token, inSales])

	if (location.pathname !== "/orderhistory" && inSales === true) {
		setInSales(false)
	} else if (location.pathname === "/orderhistory" && inSales === false) {
		setInSales(true)
	}

	return (
		<>
			{/* <Box sx={{ flexGrow: 1 }}> */ /* Box causes unnecessary empty space under navbar on some situation */}
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
										<Badge badgeContent={unSent + notReceived} color="error" >
											{user?.name} {/* Access the user's name */}
										</Badge>
									</Typography>

									<ArrowDropDownIcon />
								</IconButton>
								<IconButton
									onClick={() => { setShoppingCartOpen(true) }}
									color="inherit"
									aria-controls="user-menu"
									aria-haspopup="true"
								>
									<ShoppingCartIcon />
									<div className="products-in-shopping-cart">
										<p>
											({cart?.length || 0})
										</p>
									</div>
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
										Oma sivu
									</MenuItem>
									<MenuItem
										onClick={handleMenuClose}
										component={Link}
										to="/orderhistory"
									>
										<Badge badgeContent={unSent + notReceived} color="error" >
											Tilaushistoria
										</Badge>
									</MenuItem>
									<MenuItem
										onClick={handleMenuClose}
										component={Link}
										to="/product/new"
									>
										Lisää uusi tuote
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
			<Crumbs />
			{/* </Box> */}
			<ShoppingCart
				isOpen={isShoppingCartOpen}
				onClose={() => setShoppingCartOpen(false)}
				cart={cart}
				setCart={setCart}
			/>
		</>
	)
}

export default Navbar
