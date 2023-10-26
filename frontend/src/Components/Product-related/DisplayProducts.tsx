import { List } from "@mui/material"

import { DisplayProductsProps } from "../../Services-types/types"

import ProductCard from "../Product-cards/ProductCard"

const DisplayProducts = ({ productList }: DisplayProductsProps) => {

	return (
		<List>
			{productList.map((product, index) => (
				<ProductCard key={"products " + index} product={product} />
			))}
		</List>
	)
}

export default DisplayProducts