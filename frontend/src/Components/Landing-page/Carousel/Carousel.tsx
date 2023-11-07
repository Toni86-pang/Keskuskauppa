import "react-responsive-carousel/lib/styles/carousel.min.css"
import "react-responsive-carousel/lib/styles/carousel.css"
import { Carousel } from "react-responsive-carousel"
import { Box, styled } from "@mui/system"
import { ProductType } from "../../../Services-types/types"
import { ReactNode } from "react"
import { useNavigate } from "react-router"
import { Card, CardMedia, Paper, Typography } from "@mui/material"

interface CarouselProducts {
	carouselProducts: ProductType[]
}

function CustomCarousel({ carouselProducts }: CarouselProducts) {
	const CustomPaper = styled(Paper)`
	max-width: 100%; 
	margin: 0 auto;
	background: "#f3f6fa",
  `
  
	const CustomCard = styled(Card)`
	margin-right: 300px;
	margin-left: 300px;
  `  
	
	
	const navigate = useNavigate()

	const handleClick = (_index: number, item: ReactNode) => {
		const reactElement = item as React.ReactElement
		const productId = reactElement.props["data-productid"]
		navigate("/product/"+ productId)
	}

	return (
		<CustomPaper>
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
						
						<CustomCard key={"Carousel " + index} data-productid={product.product_id} >
							<Box
								style={{
									overflow: "hidden", 
								}}
							>
								<CardMedia
									component="img"
									src={product.product_image}
									alt={product.title}
									sx={{
										maxHeight: "300px",
										height: "auto", 
										maxWidth: "100%",
										objectFit: "cover",
										background: "#f3f6fa",
									}}
								/>
							</Box>
							<Typography variant="h4">{product.title}</Typography>
							<Typography>Hinta: {product.price}</Typography>
						</CustomCard>
						
					)
				})}
			</Carousel>
		</CustomPaper>
	)
}

export default CustomCarousel
