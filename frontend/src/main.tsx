import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App.tsx"
import Register from "./Components/RegisterNewUser.tsx"
import Login from "./Components/Login.tsx"
// import "./index.css"
import ErrorPage from "./Pages/ErrorPage.tsx"
// import { Login } from '@mui/icons-material'
import Products from "./Components/Products.tsx"
import Product, { loader as productLoader } from "./Components/Product.tsx"

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/register",
				element: <Register />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/product",
				element: <Products />,
			},
			{
				path: "/product/:id",
				element: <Product />,
				loader: productLoader,
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)
