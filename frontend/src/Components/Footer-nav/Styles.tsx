import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"

export const FooterBox = styled(Grid)({
	minHeight: "200px",
	marginTop: "auto", 
	backgroundColor: "#6096ba",
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	textAlign: "center",
	fontFamily: "sans-serif",
	color: "white",
})


export const BoxOne = styled(Box) ({
	flex: 1, 
	textAlign: "center" 
})