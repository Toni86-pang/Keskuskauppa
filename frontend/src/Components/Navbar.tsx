import { useState, MouseEvent } from "react"
import SearchIcon from "@mui/icons-material/Search"
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	Button,
	IconButton,
	Menu,
	MenuItem,
	styled,
	InputBase,
	alpha
}
	from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"

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



	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const open = Boolean(anchorEl)


	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setAnchorEl(null)
	}



	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={{ bgcolor: "#6096ba" }}>
				<Toolbar>
					<IconButton
						onClick={handleClick}
						size="large"
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{
							mr: 2,
							":hover": { bgcolor: "darkblue" }
						}}
					>
						<MenuIcon />

					</IconButton>

					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							"aria-labelledby": "basic-button",
						}}
					>
						<MenuItem onClick={handleClose}><Button href='/'>Etusivu</Button></MenuItem>
						<MenuItem onClick={handleClose}><Button href='/product'>Astiat</Button></MenuItem>
						<MenuItem onClick={handleClose}><Button href='/product'>Eläimet</Button></MenuItem>
						<MenuItem onClick={handleClose}><Button href='/product'>Astiat</Button></MenuItem>




					</Menu>


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
					<Button
						href='/register'
						color="inherit">Register</Button> <Button
						href='/login'
						color="inherit">Login</Button>
				</Toolbar>
			</AppBar>


		</Box>
	)
}

export default Navbar