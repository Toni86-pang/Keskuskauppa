import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import App from "./App.tsx"
// import "./index.css"
import ErrorPage from "./Pages/ErrorPage.tsx"
import Products, { loader as productsLoader } from "./Components/Product-related/Products.tsx"
import Product, { loader as productLoader } from "./Components/Product-related/Product.tsx"
import { loader as userLoader } from "./Components/Purchase-order-history/CheckOut.tsx"
import SellerProfile, { loader as sellerLoader } from "./Components/Profile-related/SellerProfile.tsx"
import NewProduct, { loader as newProductLoader } from "./Components/Product-related/NewProduct.tsx"
import Profile, {loader as profileLoader} from "./Components/Profile-related/Profile.tsx"
import LandingPage from "./Components/Landing-page/LandingPage.tsx"
import SearchResultsPage from "./Components/Search/SearchResultpage.tsx"
import CheckOut from "./Components/Purchase-order-history/CheckOut.tsx"
import OrderHistory, { loader as orderHistoryLoader} from "./Components/Purchase-order-history/Order-history/OrderHistory.tsx"

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
				loader: profileLoader
			},
			{
				path: "/product/new",
				element: <NewProduct />,
				loader: newProductLoader
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
				element: <OrderHistory />,
				loader: orderHistoryLoader,
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
)
