import SearchIcon from "@mui/icons-material/Search"
import {
	AppBar,
	Box,
	Toolbar,
	Typography,
	styled,
	InputBase,
	alpha,

} from "@mui/material"
import CategoryMenu from "./CategoryMenu"
import Login from "./Login"
import RegisterNewUser from "./RegisterNewUser"

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

					{/* <Button
						href='/register'
						color="inherit">Rekisteröidy</Button> */}
					<div><RegisterNewUser /></div>
					<div><Login /></div>
				</Toolbar>
			</AppBar>

		</Box >
	)
}
export default Navbar