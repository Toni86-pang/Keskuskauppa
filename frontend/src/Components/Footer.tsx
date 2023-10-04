import "./Footer.css"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"

export const Footer = () => {
	return (
		<Container className="footer" >
			<Box display="flex" justifyContent="space-between">
				<div style={{ flex: 1, textAlign: "center" }}>
					<h4>Palvelumme</h4>
					<p> Tuotteiden myynti</p>
					<p>Tuotteiden ostaminen</p>
				</div>

				<div style={{ flex: 1, textAlign: "center" }}>
					<h4> Yhteystiedot</h4>
					<p> Osoite: Testikatu 11, 01234 Teskikaupunki</p>
					<p>Puh: 040 123456</p>
					<p> Email:keskuskauppa(at)keskuskauppa.fi</p>
				</div>
				<div style={{ flex: 1, textAlign: "center" }}>
					<h4>Asiakaspalvelu</h4>
					<p> Asiakaspalvelumme palvelee arkisin klo 08.00-16.00</p>
					<p>Puh: 040 123456</p>
				</div>
			</ Box>
		</Container>
	)
}
