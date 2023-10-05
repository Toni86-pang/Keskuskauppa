import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App.tsx"
import Register from "./Components/RegisterNewUser.tsx"
import Login from "./Components/Login.tsx"
import "./index.css"
import ErrorPage from "./Pages/ErrorPage.tsx"
import Products, { loader as productsLoader } from "./Components/Products.tsx"
import Product, { loader as productLoader } from "./Components/Product.tsx"
import NewProduct from "./Components/NewProduct.tsx"
import Profile from "./Components/Profile.tsx"
import ProductSearch from "./Components/Searchbar.tsx"
// import LandingPage from "./Components/LandingPage.tsx"


const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			// {
			// 	path: "/",
			// 	element: <LandingPage />,
			// },
			{
				path: "/search", // Add the path for searching products
				element: <ProductSearch />, // Replace with the appropriate component for searching products
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
				path: "/products",
				element: <Products />,
			},
			{
				path: "/products/category/:id",
				element: <Products category={true}/>,
				loader: productsLoader
			},
			{
				path: "/products/subcategory/:id",
				element: <Products subCategory={true}/>,
				loader: productsLoader
			},
			{
				path: "/product/new",
				element: <NewProduct />,
			},
			{
				path: "/profile",
				element: <Profile />,
				// loader: userLoader,
			},
			{
				path: "/product/new",
				element: <NewProduct />
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
