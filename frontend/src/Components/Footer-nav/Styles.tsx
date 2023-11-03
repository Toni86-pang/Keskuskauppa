import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { Typography } from "@mui/material"

//Footer styles
export const FooterBox = styled(Grid)(({ theme }) => ({
	minHeight: "150px",
	marginTop: theme.spacing(6),
	backgroundColor: "#6096ba",
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	textAlign: "center",
	color: "white",
}))

export const TypographyFooter = styled(Typography)(({ theme }) => ({
	padding: theme.spacing(0.4)
}))

export const BoxOne = styled(Box)(({ theme }) => ({
	padding: theme.spacing(1.5),
	flex: 1,
	textAlign: "center"
}))
//Navbar styles

export const GridLogin = styled(Grid)(({ theme }) =>({
	//border: "1px solid black",
	[theme.breakpoints.up("md")]: {
		".css-bf530i-MuiContainer-root ": {
			paddingLeft: "0px",
			paddingRight: "0px"
		}},
	[theme.breakpoints.down("md")]: {
		marginRight: "5rem",
	}

}))


