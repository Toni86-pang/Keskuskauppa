import axios from "axios"

export const deleteUser = async (token: string) => {
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

export const fetchOwnProducts = (id: number) => {
	return axios.get("/api/product/user/" + id).then((response) => response.data)
}

export const fetchAllProducts = () => {
	return axios.get("/api/product").then(res => res.data)
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
