import { List } from "@mui/material"

import { DisplayProductsProps } from "../types"

import ProductCard from "./ProductCard"

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