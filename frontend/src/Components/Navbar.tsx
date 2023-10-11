import { useState, useContext, useEffect } from "react"
import { Link, useNavigate} from "react-router-dom"
import SearchIcon from "@mui/icons-material/Search"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	styled,
	InputBase,
	alpha,
	Menu,
	IconButton,
	MenuItem,
} from "@mui/material"
import CategoryMenu from "./CategoryMenu"
import Login from "./Login"
import RegisterNewUser from "./RegisterNewUser"
import { UserTokenContext } from "../App"
import { fetchUser } from "../services"
import { ProductType, User } from "../types"
import ShoppingCart from "./ShoppingCart"

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginRight: theme.spacing(2),
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(3),
		width: "auto",
	},
}))

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
}))

const Navbar = () => {
	const [token, setToken] = useContext(UserTokenContext)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [user, setUser] = useState<User | null>(null)
	const [isShoppingCartOpen, setShoppingCartOpen] = useState(false)
	const [cart, setCart] = useState<Array<ProductType> | null>(null)
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

	useEffect(() => {
		const storageItem = sessionStorage.getItem("myCart")
		if(storageItem !== null){
			setCart(JSON.parse(storageItem))
		} else {
			setCart(null)
		}
	}, [cart])

	return (
		<>
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
						<Search>
							<SearchIconWrapper>
								<SearchIcon />
							</SearchIconWrapper>
							<StyledInputBase
								placeholder="Haku…"
								inputProps={{ "aria-label": "search" }}
							/>
						</Search>

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
									</IconButton>
									<IconButton
										onClick={() => {setShoppingCartOpen(true)}}
										color="inherit"
										aria-controls="user-menu"
										aria-haspopup="true"
									>
										<ShoppingCartIcon />
										<>{cart?.length || 0}</>
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
			</Box>
			<ShoppingCart
				isOpen={isShoppingCartOpen}
				onClose={() => setShoppingCartOpen(false)}
			/>
		</>
	)
}
export default Navbar