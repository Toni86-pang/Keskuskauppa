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
					Something went wrong!
				</Alert>
			</Container>
		)
	}
	if (error.status === 404) return (
		<Container className='ErrorPage'>
			<Alert severity="warning">404 - Not Found!</Alert>
			<Alert severity="warning">The requested is not here</Alert>
			<Button href='/'>Main Page</Button>
		</Container>
	)
	return (
		<Container>
			<Alert variant="outlined" severity="error">
				An Unexpected error happened!
			</Alert>
			<p>({error.status}) {error.statusText}</p>
			{error.data?.message && <p>{error.data.message}</p>}
		</Container>
	)
}

export default ErrorPage
