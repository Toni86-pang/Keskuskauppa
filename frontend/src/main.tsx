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
import ProductNew from "./Components/ProductNew.tsx"
import Profile from "./Components/Profile.tsx"
import LandingPage from "./Components/LandingPage.tsx"

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <LandingPage />,
			},
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
				path: "/profile",
				element: <Profile />,
				// loader: userLoader,
			},
			{
				path: "/product/new",
				element: <ProductNew />
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
