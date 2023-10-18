import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App.tsx"
// import "./index.css"
import ErrorPage from "./Pages/ErrorPage.tsx"
import Products, { loader as productsLoader } from "./Components/Products.tsx"
import Product, { loader as productLoader } from "./Components/Product.tsx"
import { loader as userLoader } from "./Components/CheckOut.tsx"
import SellerProfile, { loader as sellerLoader } from "./Components/SellerProfile.tsx"
import NewProduct from "./Components/NewProduct.tsx"
import Profile from "./Components/Profile.tsx"
import LandingPage from "./Components/LandingPage.tsx"
import SearchResultsPage from "./Components/SearchResultpage.tsx"
import CheckOut from "./Components/CheckOut.tsx"
import OrderHistory from "./Components/OrderHistory.tsx"

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
				path: "/search-results",
				element: <SearchResultsPage />, 
			},
			{
				path: "/products",
				element: <Products />,
				loader: productsLoader
			},
			{
				path: "/products/category/:id",
				element: <Products />,
				loader: productsLoader
			},
			{
				path: "/products/subcategory/:id",
				element: <Products />,
				loader: productsLoader
			},
			{
				path: "/profile",
				element: <Profile />,
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
			{
				path: "/checkout",
				element: <CheckOut />,
				loader: userLoader,
			},
			{
				path: "/user/:id",
				element: <SellerProfile />,
				loader: sellerLoader,
			},
			{
				path: "/orderhistory",
				element: <OrderHistory />
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)
