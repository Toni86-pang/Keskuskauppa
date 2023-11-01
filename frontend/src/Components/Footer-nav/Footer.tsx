//import { Typography } from "@mui/material"
import { FooterBox, BoxOne, TypographyFooter } from "./Styles"
import Grid from "@mui/material/Grid"

export const Footer = () => {
	return (
		<FooterBox>
			<Grid container justifyContent="space-between">
				<Grid item xs={12} sm={4}>
					<BoxOne>
						<TypographyFooter variant="h6">Palvelumme</TypographyFooter>
						<TypographyFooter variant="body2">Tuotteiden myynti</TypographyFooter>
						<TypographyFooter variant="body2">Tuotteiden ostaminen</TypographyFooter>
					</BoxOne>
				</Grid>
				<Grid item xs={12} sm={4}>
					<BoxOne>
						<TypographyFooter variant="h6">Yhteystiedot</TypographyFooter>
						<TypographyFooter variant="body2">Osoite: Testikatu 11, 01234 Testikaupunki</TypographyFooter>
						<TypographyFooter variant="body2">Puh: 040 123456</TypographyFooter>
						<TypographyFooter variant="body2">Email: keskuskauppa(at)keskuskauppa.fi</TypographyFooter>
					</BoxOne>
				</Grid>
				<Grid item xs={12} sm={4}>
					<BoxOne>
						<TypographyFooter variant="h6">Asiakaspalvelu</TypographyFooter>
						<TypographyFooter variant="body2">Ma-Pe klo 08.00-16.00</TypographyFooter>
						<TypographyFooter variant="body2">Puh: 040 123456</TypographyFooter>
					</BoxOne>
				</Grid>
			</Grid>
		</FooterBox>
	)
}

