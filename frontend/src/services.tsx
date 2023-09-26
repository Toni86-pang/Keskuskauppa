import axios from "axios"

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

export const fetchOwnProducts = (id: number) => {
	return axios.get("/api/product/user/" + id).then((response) => response.data)
}