import { Typography } from "@mui/material"
import { FooterBox, BoxOne } from "./Styles"
import Grid from "@mui/material/Grid"

export const Footer = () => {
	return (
		<FooterBox>
			<Grid container justifyContent="space-between">
				<Grid item xs={12} sm={4}>
					<BoxOne>
						<Typography variant="h6">Palvelumme</Typography>
						<Typography variant="body2">Tuotteiden myynti</Typography>
						<Typography variant="body2">Tuotteiden ostaminen</Typography>
					</BoxOne>
				</Grid>
				<Grid item xs={12} sm={4}>
					<BoxOne>
						<Typography variant="h6">Yhteystiedot</Typography>
						<Typography variant="body2">Osoite: Testikatu 11, 01234 Testikaupunki</Typography>
						<Typography variant="body2">Puh: 040 123456</Typography>
						<Typography variant="body2">Email: keskuskauppa(at)keskuskauppa.fi</Typography>
					</BoxOne>
				</Grid>
				<Grid item xs={12} sm={4}>
					<BoxOne>
						<Typography variant="h6">Asiakaspalvelu</Typography>
						<Typography variant="body2">Asiakaspalvelumme palvelee arkisin klo 08.00-16.00</Typography>
						<Typography variant="body2">Puh: 040 123456</Typography>
					</BoxOne>
				</Grid>
			</Grid>
		</FooterBox>
	)
}

