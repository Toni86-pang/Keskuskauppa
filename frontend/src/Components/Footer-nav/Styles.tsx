import { styled} from "@mui/material/styles"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid"
import { Typography } from "@mui/material"

export const FooterBox = styled(Grid)({
	minHeight: "150px",
	marginTop: "auto", 
	backgroundColor: "#6096ba",
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	textAlign: "center",
	color: "white",
})

export const TypographyFooter = styled(Typography)(({ theme }) =>({
	padding: theme.spacing(0.4)
}))

export const BoxOne = styled(Box) (({ theme }) =>({
	padding: theme.spacing(1.5),
	flex: 1, 
	textAlign: "center" 
}))