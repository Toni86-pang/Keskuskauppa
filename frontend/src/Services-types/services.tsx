import axios from "axios"
import { AverageStars, BoughtProps, Category, ProductType, Review, ReviewComment, Sale, SoldProps, UpdatedProduct, UpdatedUser, User } from "./types"


//Löydät APIt tässä järjestyksessä:
//USERS
//PRODUCTS
//CATEGORIES
//SALES
//REVIEWS & COMMENTS
//SEARCH


// ------------------------------------------- USERS ----------------------------------------------

export const deleteUser = (token: string) => {
	return axios.delete("/api/users/delete", {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	}).then((response) => response.data)
}

export const fetchUser = async (token: string) => {
	try {
		const response = await axios.get("/api/users/user/", {
			headers: {
				"Authorization": `Bearer ${token}`
			} 
		})
		return response.data	
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 401) {
			return null
		}
		else {
			console.error("Error fetching user:", error)
			return null
		}
	}
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

export const registerUser = async (user: FormData) => {
	try {
		const response = await axios.post("/api/users/register", user, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
		return response
	} catch (error) {
		console.error("Error in registerUser:", error)
		throw error
	}
}

// ------------------------------------------- PRODUCTS ----------------------------------------------

export const newProduct = async (product: FormData, token: string) => {
	const response = await axios.post("/api/product/", product, {
		headers: {
			"Authorization": `Bearer ${token}`,
			"Content-Type": "multipart/form-data", // Important for multer
		}
	})
	return response
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

export const fetchOwnSold = async (token: string) => {
	const response = await axios.get("/api/sales/sold", {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	})
	const data = response.data as SoldProps[]
	return data
}

export const fetchOwnBought = async (token: string) => {
	const response = await axios.get("/api/sales/bought", {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	})
	const data = response.data as BoughtProps[]

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

// ------------------------------------------- CATEOGIRES ----------------------------------------------

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

// ----------------------------------------------- SALES ----------------------------------------------

export const setSaleSent = async (saleId: number, token: string) => {
	const response = await axios.put("/api/sales/update/" + saleId,
		{
			"sales_status": 3
		}, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		})
	return response
}

export const fetchSale = (token: string, id: number) => {
	return axios.get("/api/sales/" + id, {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	}).then((response) => response.data)
}

export const fetchSaleStatus = async (statusId: number) => {
	const response = await axios.get("/api/sales/status/" + statusId)
	return response.data
}

export const newSale = async (sale: Sale, token: string) => {
	try {
		const response = await axios.post("/api/sales/", sale, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
		})
		return response
	} catch (error) {
		console.error("Error posting", error)
		return undefined
	}
}

export const setSaleReceived = async (saleId: number, token: string) => {
	const response = await axios.put("/api/sales/update/" + saleId,
		{
			"sales_status": 4
		}, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		})
	return response
}

export const cancelSale = async (saleId: number, token: string) => {
	const response = await axios.put("/api/sales/update/" + saleId,
		{
			"sales_status": 5
		}, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		})
	return response
}

export const returnProductToShop = async (saleId: number, token: string) => {
	const response = await axios.put("/api/product/listed/" + saleId, 
		{
			listed: true
		}, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		})
	console.log(response)
	return response
}

// -------------------------------------------- REVIEWS & COMMENTS ----------------------------------------------

export const newReview = async (review: Review, token: string) => {
	try {
		const response = await axios.post("/api/review/", review, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
		})
		return response
	} catch (error) {
		console.error("Error posting", error)
		return undefined
	}
}

export const putReviewedTrue = async (saleId: number, token: string) => {
	const response = await axios.put("/api/sales/reviewupdate/" + saleId,
		{
			"reviewed": true
		}, {
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		})
	return response
}

export const fetchStarRating = async (id: number) => {
	const response = await axios.get(`/api/review/user/average/${id}`)
	const stars: AverageStars = response.data
	return stars.average_score	
}

export const fetchReviewComment = async (reviewId: number) => {
	const response = await axios.get(`/api/review/comment/${reviewId}`)
	return response.data
}

export const fetchReviewsForSeller = async (sellerId: number) => {
	const response = await axios.get("/api/review/user/" + sellerId)
	const reviews: Review[] = response.data
	return reviews
}

export const leaveComment = async (commentData: ReviewComment, token: string) => {
	const response = await axios.post("/api/review/comment", commentData,  {
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		},
	})
	return response
}

// ------------------------------------------------ SEARCH ----------------------------------------------

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