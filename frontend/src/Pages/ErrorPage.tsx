import { Alert, Container, Button } from "@mui/material"
import {
	useRouteError,
	isRouteErrorResponse
} from "react-router-dom"


function ErrorPage() {
	const error = useRouteError()
	if (!isRouteErrorResponse(error)) {
		console.error(error)
		return (
			<Container>
				<Alert variant="outlined" severity="error">
					Jotain meni vikaan!
				</Alert>
			</Container>
		)
	}
	if (error.status === 404) return (
		<Container className='ErrorPage'>
			<Alert severity="warning">404 - Sivua ei löytynyt</Alert>
			<Alert severity="warning">Pyyntöä ei voitu toteuttaa</Alert>
			<Button href='/'>Etusivu</Button>
		</Container>
	)
	return (
		<Container>
			<Alert variant="outlined" severity="error">
			Tapahtui odottamaton virhe!
			</Alert>
			<p>({error.status}) {error.statusText}</p>
			{error.data?.message && <p>{error.data.message}</p>}
		</Container>
	)
}

export default ErrorPage
