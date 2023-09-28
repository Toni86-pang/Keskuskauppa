import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import SearchIcon from "@mui/icons-material/Search"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	Button,
	styled,
	InputBase,
	alpha,
	Menu,
	IconButton,
	MenuItem,
} from "@mui/material"
import CategoryMenu from "./CategoryMenu"
import Login from "./Login"
import { UserTokenContext } from "../App"

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

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleMenuClose = () => {
		setAnchorEl(null)
	}

	const handleLogout = () => {
		// Clear the token and reset the user state
		localStorage.removeItem("token")
		setToken("")
		handleMenuClose()
	}
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={{ bgcolor: "#6096ba" }}>
				<Toolbar>
					<CategoryMenu />
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Keskuskauppa
					</Typography>
					<Search>
						<SearchIconWrapper>
							<SearchIcon />
						</SearchIconWrapper>
						<StyledInputBase
							placeholder="Haku…"
							inputProps={{ "aria-label": "search" }}
						/>
					</Search>

					{token ? (
						// User is logged in, display user dropdown
						<>
							<IconButton
								onClick={handleMenuOpen}
								color="inherit"
								aria-controls="user-menu"
								aria-haspopup="true"
							>
								<AccountCircleIcon />
								<ArrowDropDownIcon />
							</IconButton>
							<Menu
								id="user-menu"
								anchorEl={anchorEl}
								open={Boolean(anchorEl)}
								onClose={handleMenuClose}
							>
								<MenuItem 
									onClick={handleMenuClose}
									component={Link} to="/profile">
									Profiili
								</MenuItem>
								<MenuItem 
									onClick={handleMenuClose}
									component={Link} 
									to="/product/new">	
									Lisää uusituote
								</MenuItem>
								<MenuItem 
									onClick={handleMenuClose}
									component={Link} 
									to="/products">
									Tuoteet
								</MenuItem>

								<MenuItem onClick={handleLogout}>Kirjaudu ulos</MenuItem>
							</Menu>
						</>
					) : (
						<>
							<Button href="/register" color="inherit">
								Rekisteröidy
							</Button>
							<div>
								<Login />
							</div>
						</>
					)}
				</Toolbar>
			</AppBar>
		</Box>
	)
}
export default Navbar