import img1 from "./assets/Tulesa.png"
import img3 from "./assets/img3.jpeg"
import img4 from "./assets/img4.jpg"
import img5 from "./assets/img5.png"
import img6 from "./assets/img6.jpg"
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
					<img src={img1} alt="Product 1"
						className="carousel-image"
					/>
					<div className="legend">
						<h2>item 1</h2>
						<p>Price: €10.99</p>
					</div>
				</div>

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
				<div className="carousel-slide">
					<img src={img6} alt="Product 2"
					/>
					<div className="legend">
						<h2>item 6</h2>
						<p>Price: €19.99</p>
					</div>
				</div>
			</Carousel>
		</div>
	)
}

export default CustomCarousel
