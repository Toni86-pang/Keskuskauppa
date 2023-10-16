import axios from "axios"
import { Category, ProductType, Sale, UpdatedProduct, UpdatedUser, User } from "./types"

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


export const fetchUsernameByUserId = async (id: number) => {
	try {
		const response = await axios.get(`/api/users/${id}`)
		const data = response.data[0] as User // Extract the first user object from the array
		return data.username
	} catch (error) {
		console.error("Error fetching username by user ID:", error)
		return undefined
	}
}
  
  
  
export const fetchUserDetailsByUserId = async (user_id: number) => {
	const response = await axios.get("/api/users/" + user_id)
	const data = response.data[0] as User
	return data
}

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

export const fetchUsersProducts = async (id: number) => {
	const response = await axios.get("/api/product/user/" + id)
	const data = response.data as ProductType[]
	return data
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

export const updateProduct = async (productId: number, updatedData: UpdatedProduct, token: string) => {
	await axios.put(`/api/product/update/${productId}`, updatedData,{
		headers: {
			"Authorization": `Bearer ${token}`
		}
	})
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

export const newProduct = async (product: ProductType, token: string) => {
	const response = await axios.post("/api/product/", product, {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	})
	return response
}

export const newSale = async (sale: Sale, token: string) => {
	const response = await axios.post("/api/sales/", sale, {
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		},
	})
	return response
}

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
	const response = await fetch(`/api/search?query=${searchQuery}`)
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