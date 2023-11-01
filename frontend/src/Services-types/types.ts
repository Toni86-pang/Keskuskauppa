import { Dispatch } from "react"

//You will find types and interfaces in the following order:
//USERS
//PRODUCTS
//CATEGORIES
//SALES
//REVIEWS & COMMENTS
//NAVBAR
//CRUMBS
//VERIFY

//------------------------------------------- USERS ------------------------------------------------------

export interface User {
	user_id: number,
    username: string,
    password: string,
	name: string,
	email: string,
	phone: string,
	address: string,
	city: string,
	postal_code: string,
	user_image: string
	reviews?: number
	reg_day?: string
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
	user_image: "",
	postal_code: "",
	reviews: 0
}

export interface UserValues {
	username: "",
	password: ""
}
export type categoryMapType = {
    [key: string]: [string, number] 
}

export interface DisplayProductsProps {
    productList: ProductType[]
}
export interface ChangePasswordInputs {
	currentPassword: string
	newPassword: string
	confirmPassword: string
}
export interface CategoryProducts {
    categoryHeader: string
    products: ProductType[]
}

export interface ChangePasswordProps {
	username: string
	open: boolean
	onClose: () => void
}

export interface UpdateProfileProps {
	isOpen: boolean
	close: (updatedUser: User) => void
	user: User
}

export interface UpdatedUser {
    address: string,
    city: string,
    postal_code: string,
    phone: string,
	user_image?: string
}

export interface UserProducts {
	loadedUser: User
	stars: number
	products: ProductType[]
	
}

//------------------------------------------- PRODUCTS ------------------------------------------------------

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
	price: string
	product_image: string
	listed: boolean
	category_name?: string
	subcategory_name?: string
}

export const initialStateProduct: ProductType = {
	user_id: 0,
	title: "",
	category_id: 0,
	subcategory_id: 0,
	city: "",
	postal_code: "",
	description: "",
	price: "",
	listed: true,
	product_image: ""
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
/* update types*/
export interface UpdatedProduct {
    title: string,
    category_id: number,
    subcategory_id: number,
    city: string,
    postal_code: string,
    description: string,
    price: number,
	product_image: string
}
export interface UpdateProductModalProps {
	isOpen: boolean
	onClose: (updatedProduct: ProductType) => void
	token: string
	product: ProductType
  }

export interface ReviewModalProps {
	isOpen: boolean
	onClose: () => void
	token: string
	sale_id: number
	seller_id?: number
	sale?: Sale
	changeButton: () => void
  }

export interface AverageStars {
	average_score: number
}
  
export interface Review {
	sales_id: number
	seller_id?: number
	buyer_id?: number
	description?: string
	seen?: boolean
	stars?: number
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



export interface NavbarProps {
	cart: ProductType[] | null
	setCart: Dispatch<React.SetStateAction<ProductType[] | null>>
}

export interface BoughtProps {
	sales_id: number
	sales_status: string
	title: string
	price: number
	buyer?: string
	seller?: string
	listed?: boolean
	product_image: string
}

export interface OrderDetailsProps {
	isSeller: boolean
	isOpen: boolean
	saleId: number
	onClose: () => void
}

export interface SoldProps {
	sales_id: number
	sales_status: string
	title: string
	price: number
	buyer?: string
	seller?: string
	listed: boolean
	product_image: string
}

export interface OrderCardProps {
	product: BoughtProps | SoldProps
}

export interface SummaryProps {
	isOpen: boolean
	onClose: () => void
	buyerInfo: BuyerInfo
	sum: number
	cart: ProductType[] | null
  }

export interface BuyerInfo { 
		buyer_id: number
		buyer_name: string
		buyer_address: string
		buyer_city: string
		buyer_postcode: string
		buyer_phone: string
		buyer_email: string
  }

export interface Sale {
	sales_id?: number
	product_id: number
	buyer_id: number
	buyer_name: string
	buyer_address: string
	buyer_city: string
	buyer_postcode: string
	buyer_phone: string
	buyer_email: string
	seller_id: number
	sales_status: number
	reviewed?: boolean
}


// ------------------------------------------ REVIEWS & COMMENTS -----------------------------------------------

export interface ReviewModalProps {
	isOpen: boolean
	onClose: () => void
	token: string
	sale_id: number
	seller_id?: number
	sale?: Sale
	changeButton: () => void
  }

export interface AverageStars {
	average_score: number
}
  


export interface Review {
	review_id?: number
	sales_id: number
	seller_id?: number
	buyer_id?: number
	description?: string
	review_date?: string
	seen?: boolean
	stars?: number
}

export interface AverageStars {
	average_score: number
}
export interface ReviewComment {
	comment_id?: number
	review_id: number
	comment: string
}

export interface ReviewCardProps {
	isOwn: boolean
	review: Review
	reviewComment?: ReviewComment
	user: User
}

export interface CommentCardProps {
	reviewComment: ReviewComment
	seller: User | undefined
}

// --------------------------------------------- NAVBAR -----------------------------------------------


export interface NavbarProps {
	cart: ProductType[] | null
	setCart: Dispatch<React.SetStateAction<ProductType[] | null>>
}

// --------------------------------------------- CRUMBS -----------------------------------------------

export type BreadcrumbResolver = (params: string) => Promise<[string, string][]>

// --------------------------------------------- VERIFY -----------------------------------------------

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
