/* eslint-disable @typescript-eslint/no-unused-vars */
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return axios.get("/api/users/user/", {
		headers: {
			"Authorization": `Bearer ${token}`
		}
	}).then((response) => response.data)
}

export const fetchOwnProducts = (id: number) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return axios.get("/api/product/user/" + id).then((response) => response.data)
}