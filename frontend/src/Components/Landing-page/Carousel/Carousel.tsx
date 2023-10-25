import img3 from "./landing-page-assets/img3.jpg"
import img4 from "./landing-page-assets/img4.jpg"
import img5 from "./landing-page-assets/img5.jpg"
import "react-responsive-carousel/lib/styles/carousel.min.css" 
import "react-responsive-carousel/lib/styles/carousel.css"
import { Carousel } from "react-responsive-carousel"
import "./Carousel.css"

function CustomCarousel() {
	
	return (
		<div
			className="carousel-container" 
		>
			<Carousel
				autoPlay={true}
				interval={1500} 
				infiniteLoop={true}
			>
				<div className="carousel-slide">
					<img src={img3} alt="Product 2"
					/>
					<div className="legend">
						<h2>item 2</h2>
						<p>Price: €19.99</p>
					</div>
				</div>
				<div className="carousel-slide">
					<img src={img4} alt="Product 2"
					/>
					<div className="legend">
						<h2>item 4</h2>
						<p>Price: €19.99</p>
					</div>
				</div>
				<div className="carousel-slide">
					<img src={img5} alt="Product 2"
					/>
					<div className="legend">
						<h2>item 5</h2>
						<p>Price: €19.99</p>
					</div>
				</div>
			</Carousel>
		</div>
	)
}

export default CustomCarousel
