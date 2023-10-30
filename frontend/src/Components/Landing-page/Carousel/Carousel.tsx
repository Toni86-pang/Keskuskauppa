import "react-responsive-carousel/lib/styles/carousel.min.css"
import "react-responsive-carousel/lib/styles/carousel.css"
import { Carousel } from "react-responsive-carousel"
import "./Carousel.css"
import { ProductType } from "../../../Services-types/types"
import { ReactNode } from "react"
import { useNavigate } from "react-router"

interface CarouselProducts {
	carouselProducts: ProductType[]
}

function CustomCarousel({ carouselProducts }: CarouselProducts) {
	const navigate = useNavigate()

	const handleClick = (_index: number, item: ReactNode) => {
		const reactElement = item as React.ReactElement
		const productId = reactElement.props["data-productid"]
		navigate("/product/"+ productId)
	}

	return (
		<div className="carousel-container">

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
						<div key={"Carousel " + index} data-productid={product.product_id} className="carousel-slide">

							<img className="responsive-image" src={product.product_image} alt={product.title} />

							<div className="legend">
								<h2>{product.title}</h2>
								<p>Hinta: {product.price}</p>
							</div>
						</div>
					)
				})}
			</Carousel >
		</div>
	)
}

export default CustomCarousel
