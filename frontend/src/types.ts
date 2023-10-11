import { Dispatch } from "react"

export interface User {
	user_id: number,
    username: string,
    password: string,
	name: string,
	email: string,
	phone: string,
	address: string,
	city: string,
	postal_code:string,
	is_Admin?: boolean,
	reviews?: number
}

export interface UserValues {
	username: "",
	password: ""
}

export interface ProductType {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	product_id?: any
	user_id: number
	title: string
	category_id: number
	subcategory_id: number
	city: string
    postal_code: string
    description: string
	price: number
	// product_image?: any
}

export interface ProductProps {
    product: ProductType
	onClose?: () => void
	setCart?: Dispatch<React.SetStateAction<ProductType[] | null>>
  }

export interface CategoryProps {
	category?: boolean
	subCategory?: boolean
  }

export interface Category {
	category_name: string
	category_id: number
}

export interface Subcategory {
	subcategory_id: number
	subcategory_name: string
	category_id: number
}

export interface UpdateProfileProps {
	isOpen: boolean
	close: (updatedUser: User) => void
	user: User
}

export interface VerifyProps {
	titleText?: string
	messageText: string
	isOpen: boolean
	setOpen: (open:boolean) => void
	onAccept: () => void
	onDecline?: () => void
	acceptButtonText?: string
	declineButtonText?: string
	preformattedText?: string
}

export interface UpdateProductModalProps {
    isOpen: boolean
    onClose: () => void
    productId: number
    title: string
    category_id: number
    subcategory_id: number
    city: string
    postal_code: string
    description: string
    price: number
  }

export interface ShoppingCartProps {
    isOpen: boolean
    onClose: () => void
	cart: ProductType[] | null
	setCart: Dispatch<React.SetStateAction<ProductType[] | null>>
  }

export interface Category {
	category_id: number
	category_name: string
	subcategory_id: number
	subcategory_name: string
}

export interface DeleteButtonprops {
	id: number
	onDelete: () => void
}

export interface UpdatedProduct {
    title: string,
    category_id: number,
    subcategory_id: number,
    city: string,
    postal_code: string,
    description: string,
    price: number
}

export interface UpdatedUser {
    address: string,
    city: string,
    postal_code: string,
    phone: string
}

export interface NavbarProps {
	cart: ProductType[] | null
	setCart: Dispatch<React.SetStateAction<ProductType[] | null>>
}

export const initialState: User = {
	user_id: 0,
	username: "",
	password: "",
	name: "",
	email: "",
	phone: "",
	address: "",
	city: "",
	postal_code: "",
	is_Admin: false,
	reviews: 0
}

export const initialStateProduct: ProductType = {
	user_id: 0,
	title: "",
	category_id: 0,
	subcategory_id: 0,
	city: "",
	postal_code: "",
	description: "",
	price: 0
	// product_image?: any
}