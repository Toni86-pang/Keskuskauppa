import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
// import AccountCircleIcon from "@mui/icons-material/AccountCircle"
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
	Badge,
	Grid
} from "@mui/material"
import CategoryMenu from "./CategoryMenu"
import Login from "../Register-login/Login"
import RegisterNewUser from "../Register-login/RegisterNewUser"
import { UserTokenContext } from "../../App"
import { fetchUser } from "../../Services-types/services"
import { NavbarProps, User } from "../../Services-types/types"
import ShoppingCart from "../Purchase-order-history/ShoppingCart"
import "./Navbar.css"
import Crumbs from "../Crumbs/Crumbs"
import ProductSearch from "../Search/Searchbar"
import { useNewSaleAndReviewContext } from "../../NewSaleAndReviewContext"
import Avatar from "@mui/material/Avatar"
import { GridLogin, BoxSiteName } from "./Styles"


const Navbar = ({ cart, setCart }: NavbarProps) => {
	const [token, setToken] = useContext(UserTokenContext)
	const { reviewCount, saleCount } = useNewSaleAndReviewContext ()
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [user, setUser] = useState<User | null>(null)
	const [isShoppingCartOpen, setShoppingCartOpen] = useState(false)
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
					}
				} catch (error) {
					console.error("Error fetching user:", error)
				}
			}
		}
		fetchUserData()
	}, [token])

	return (
		<>
			{/* <Box sx={{ flexGrow: 1 }}> */ /* Box causes unnecessary empty space under navbar on some situation */}
			<Grid container direction="row">
				<AppBar position="static" sx={{ bgcolor: "#6096ba", padding:"15px"  }}>
					<Toolbar sx={{ display: "flex", justifyContent: "space-between"}}>
						{/* Left side (store name and category menu) */}
						<Grid item>
							<CategoryMenu />
						</Grid>
						<Grid item >
							<BoxSiteName>
								<Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
									<Typography variant="h4"  sx={{}}>
										Keskuskauppa
									</Typography>
								</Link>
							</BoxSiteName>
						</Grid>
						{/* Middle (search bar) */}
						<Grid item>
							<Box sx={{ marginLeft: "" }}>
								<ProductSearch />
							</Box>
						</Grid>
						{/* Right side (user-related elements) */}
						<Grid item>
							<Box>
								{token ? (
									<>
										<IconButton
											onClick={handleMenuOpen}
											color="inherit"
											aria-controls="user-menu"
											aria-haspopup="true"
										>
											<Avatar src={typeof user?.user_image === "string" ? user.user_image : undefined}
												alt={user?.name}
												sx={{
													width: "25",
													height: "25"

												}} />

											<Typography variant="body1" sx={{ mt: 1 }}>
												<Badge badgeContent={saleCount + reviewCount} color="info" >
													{user?.name}
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

											<div className="products-in-shopping-cart">
												<Badge badgeContent={cart?.length || 0} color="info">
													<ShoppingCartIcon />
												</Badge>
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
												<Badge badgeContent={reviewCount} color="info" >Oma sivu</Badge>
											</MenuItem>
											<MenuItem
												onClick={handleMenuClose}
												component={Link}
												to="/orderhistory"
											>
												<Badge badgeContent={saleCount} color="info" >
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
							
									<Grid container>
										<Grid item xs={6} sm={6}>
											<RegisterNewUser />
										</Grid>
										<GridLogin item xs={6} sm={6}>
											<Login />
										</GridLogin>
									</Grid>	
							
								)}
							</Box>
						</Grid>
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
			</Grid>
		</>
	)
}

export default Navbar



