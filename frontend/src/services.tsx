import axios from "axios"
import { Category, ProductType, UpdatedProduct, UpdatedUser, } from "./types"

export const deleteUser = (token: string) => {
	return axios.delete("/api/users/delete", {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	}).then((response) => response.data)
}

export const fetchUser = (token: string) => {
	return axios.get("/api/users/user/", {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	}).then((response) => response.data)
}

// export const fetchProductOwner = (id: number) => {
// 	return axios.get("/api/users/user/" + id).then((response) => response.data)
// }

export const updateUser = async (updatedData: UpdatedUser, token: string) => {
	await axios.put("/api/users/update", updatedData, {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	})
}

export const fetchOwnProducts = (id: number) => {
	return axios.get("/api/product/user/" + id).then((response) => response.data)
}

export const fetchProduct = async (id: number) => {
	const response = await axios.get("/api/product/" + id)
	const data = response.data as ProductType
	return data
}

export const fetchAllProducts = async () => {
	const response = await axios.get("/api/product")
	const data = response.data as ProductType[]
	return data
}

export const updateProduct = async (productId: number, updatedData: UpdatedProduct) => {
	await axios.put(`/api/product/update/${productId}`, updatedData)
}

export const deleteProduct = (product_id: number) => {
	return axios.delete(`/api/product/${product_id}`).then((response) => response.data)
}

export const fetchCategories = async () => {
	const response = await axios.get("/api/category")
	const data = response.data as Category[]
	return data
}

export const fetchSubcategories = async () => {
	const response = await axios.get("/api/category/subcategory")
	const data = response.data as Category[]
	return data
}

export const fetchIndividualSubcategory = async (categoryId: number) => {
	const response = await axios.get("/api/category/subcategory/" + categoryId)
	const data = response.data as Category[]
	return data
}

// export const loginUser = async (username: string, password: string) => {
// 	const response = await axios.post("/api/users/login", {
// 		username,
// 		password
// 	})
// 	return response
// }

// export const registerUser = async (newUser: User) => {
// 	const response = await axios.post("/api/users/register", newUser, {
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 	})
// 	return response
// }

export const newProduct = async (product: ProductType) => {
	const response = await axios.post("/api/product/", product, {
		headers: {
			"Content-Type": "application/json",
		},
	})
	return response
}

// export const fetchAllProducts = () => {
// 	return axios.get("/api/product").then(res => res.data)
// }

export const fetchCategoryName = (id: number) => {
	return axios.get(`/api/category/categoryname/${id}`).then(res => res.data)
}

export const fetchSubcategoryName = (id: number) => {
	return axios.get(`/api/category/subcategoryname/${id}`).then(res => res.data)
}

export const fetchProductsByCategory = (id: number) => {
	return axios.get(`/api/product/category/${id}`).then(res => res.data)
}

export const fetchProductsBySubcategory = (id: number) => {
	return axios.get(`/api/product/subcategory/${id}`).then(res => res.data)
}

/*   search api:s          */
export const searchProducts = async (searchQuery:string):Promise<ProductType[]> => {
	const response = await fetch(`/api/product/search?query=${searchQuery}`)
	if (!response.ok) {
		throw new Error("Network response was not ok")
	}
	const products = await response.json()
	return products
}
  

// export const fetchsearchAllProducts = async (query:string) => {
// 	const response = await axios.get("/api/product")
// 	const data = response.data as ProductType[]
// 	return data
// }
 
// export const fetchsearchCategories = async (query:string) => {
// 	const response = await axios.get("/api/category")
// 	const data = response.data as Category[]
// 	return data
// }