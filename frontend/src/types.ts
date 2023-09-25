export interface User {
	user_id?: number,
    username: string,
    password: string,
	name?: string,
	email?: string,
	phone?: string,
	address?: string,
	city?: string,
	postal_code?:string,
	is_Admin?: boolean,
	reviews?: number
}

export interface ProductType {
	product_id: number
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

export interface Category {
	category_name: string
	category_id: number
}

export interface Subcategory {
	subcategory_id: number
	subcategory_name: string
	category_id: number
}

export interface Props {
	isOpen: boolean
	close: (updatedUser: User) => void
	user: User
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