import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import DeleteIcon from "@mui/icons-material/Delete"
import { Grid } from "@mui/material"
import { ProductProps, ProductType } from "../../Services-types/types"
import { useNavigate } from "react-router"
import { createTheme, ThemeProvider } from "@mui/material/styles"


const cardStyle = {
	marginTop: "10px",
	marginBottom: "10px"

}

const gridContainerStyle = {
	alignItems: "center"
}

function SalesProductCard({ product, onClose, setCart }: ProductProps) {

	const navigate = useNavigate()

	const handleRemoveFromCart = (product_id: ProductType) => {
		const storageItem = sessionStorage.getItem("myCart")
		const tempCart: ProductType[] = storageItem !== null ? JSON.parse(storageItem) : []
		const filteredCart: ProductType[] = tempCart.filter(function (cartProduct) {return cartProduct.product_id !== product_id})
		sessionStorage.clear()
		if(filteredCart.length > 0 && setCart !== undefined){
			setCart(filteredCart)
			sessionStorage.setItem("myCart", JSON.stringify(filteredCart))
		} else if(setCart !== undefined){
			setCart(null)
		}
	}

	const theme = createTheme({
		palette: {
			primary: {
				main: "#ffffff",
			},
			secondary: {
				main: "#adadad",
			}
		}
	})

	return (
		<ThemeProvider theme={theme}>
			<Card style={cardStyle} component="div">
				<CardContent>
					<Grid 
						container
						style={gridContainerStyle} 
						component={"div"}
					>
						<Grid
							sx={{ cursor: "pointer", m: "15px" }}
							component="div"
							onClick={() => {
								if(onClose !== undefined){
									navigate(`/product/${product.product_id}`)
									onClose()
								}
							}}>
							<Grid item xs={15} sx={{ m: 2 }}>
								<CardMedia
									component="img"
									height="150"
									width="150"
									image={product.product_image ? product.product_image : "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e"}
									alt={product.title}
								/>
							</Grid>
						</Grid>
						<Grid item xs={4.5} >
							<Grid item xs={10} sx={{ m: 2 }}>
								<Typography variant="h6" component="div">
									{product.title}
								</Typography>
								<Typography pb={2} component="div">Hinta {product.price} €</Typography>
								<Button variant="contained" color="secondary">
									<DeleteIcon fontSize="medium" color="primary" onClick={() => {
										handleRemoveFromCart(product.product_id)}}>
									</DeleteIcon>
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</ThemeProvider>
	)
}

export default SalesProductCard
