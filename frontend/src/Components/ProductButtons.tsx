import { useState } from "react"
import Button from "@mui/material/Button"
import UpdateProduct from "./UpdateProducts"


interface Product {
    id: number
    title: string
    categoryID: number
    subcategoryID: number
    location: string
    description: string
    price: number
  }

interface ProductItemProps {
  product: Product
  onDelete: (productId: number) => void
  onModify: (productId: number, modifiedData: Product) => void
}

function ProductItem({ product, onDelete, onModify }: ProductItemProps) {
	const [isModifyDialogOpen, setModifyDialogOpen] = useState(false)
	const [modifiedProduct, setModifiedProduct] = useState(product)

	const handleDelete = async () => {
		try {
			const response = await fetch(`/api/product/delete/${product.id}`, {
				method: "DELETE"
			})

			if (response.ok) {
				onDelete(product.id)
			}
		} catch (error) {
			console.error("Error deleting product:", error)
		}
	}

	const handleOpenModifyDialog = () => {
		setModifyDialogOpen(true)
	}

	const handleCloseModifyDialog = () => {
		setModifyDialogOpen(false)
	}
	const handleModify = (modifiedData: Product) => {
		onModify(product.id, modifiedData)
		setModifiedProduct(modifiedData)
		handleCloseModifyDialog()
	}


	return (
		<div>
			<div>
				<p>Titile: {modifiedProduct.title}</p>
				<p>Category ID: {modifiedProduct.categoryID}</p>
				<p>Subcategory ID: {modifiedProduct.subcategoryID}</p>
			</div>
			<Button color="secondary" onClick={handleDelete}> Delete</Button>
			<Button color="primary" onClick={handleOpenModifyDialog}> Modify</Button>

			<UpdateProduct
				open={isModifyDialogOpen}
				onClose={handleCloseModifyDialog}
				onModify={handleModify}
				initialData={modifiedProduct}
			/>
		</div>
	)
}

export default ProductItem