import axios from "axios"
import { Category, ProductType, UpdatedProduct, UpdatedUser, User, } from "./types"

export const deleteUser = async (token: string) => {
	return axios
		.delete("/api/users/delete", {
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

export const deleteProduct = async (product: ProductType) => {
	await axios.delete(`/api/product/delete/${product?.product_id}`)
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

export const loginUser = async (username: string, password: string) => {
	const response = await axios.post("/api/users/login", {
		username,
		password
	})
	const token = response.data.token
	return token
}

export const registerUser = async (newUser: User) => {
	const response = await axios.post("/api/users/register", newUser, {
		headers: {
			"Content-Type": "application/json",
		},
	})
	return response
}

export const newProduct = async (product: ProductType) => {
	const response = await axios.post("/api/product/", product, {
		headers: {
			"Content-Type": "application/json",
		},
	})
	return response
}