import "react-responsive-carousel/lib/styles/carousel.min.css"
import "react-responsive-carousel/lib/styles/carousel.css"
import { Carousel } from "react-responsive-carousel"
import { makeStyles } from "@mui/material/styles"
import { ProductType } from "../../../Services-types/types"
import { ReactNode } from "react"
import { useNavigate } from "react-router"
import { Card, CardContent, CardMedia, Paper, Typography } from "@mui/material"

interface CarouselProducts {
	carouselProducts: ProductType[]
}

function CustomCarousel({ carouselProducts }: CarouselProducts) {
	const useStyles = makeStyles({
		carouselContainer: {
			maxWidth: "1920px",
			minWidth: "200px",
			maxHeight: "200px",
			width: "auto",
			height: "auto",
			objectFit: "contain",
			margin: "0px auto",
			fontFamily: "arial",
		},
		responsiveImage: {
			aspectRatio: "0",
			objectFit: "contain",
		},
	})

	const classes = useStyles()
	const navigate = useNavigate()

	const handleClick = (_index: number, item: ReactNode) => {
		const reactElement = item as React.ReactElement
		const productId = reactElement.props["data-productid"]
		navigate("/product/"+ productId)
	}

	return (
		<Paper sx={classes.carouselcontainer}>

			<Carousel
				onClickItem={handleClick}
				showThumbs={false}
				centerMode
				autoPlay={true}
				interval={1500}
				infiniteLoop={true}
			>

				{carouselProducts.map((product, index) => {
					return (
						<Card key={"Carousel " + index} data-productid={product.product_id} className="carousel-slide">
							<CardMedia 
								component="img" 
								sx={classes.responsiveimage}
								src={product.product_image} 
								alt={product.title} />

							<CardContent>
								<Typography variant="h3">{product.title}</Typography>
								<Typography>Hinta: {product.price}</Typography>
							</CardContent>
						</Card>
					)
				})}
			</Carousel >
		</Paper>
	)
}

export default CustomCarousel
