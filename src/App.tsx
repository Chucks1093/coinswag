import { Fragment } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import DashboardLayout from "./pages/dashboard/dashboard-layout/DashboardLayout";
import AuthLayout from "./pages/auth/auth-layout/AuthLayout";
import Login from "./pages/auth/auth-section/Login";
import Register from "./pages/auth/auth-section/Register";
import OnchainProviders from "./providers/onchainkit-provider";
import { Toaster } from "react-hot-toast";
import NewStore from "./pages/auth/auth-section/NewStore";
import Products from "./pages/dashboard/Products";
import Customers from "./pages/dashboard/Customers";
import Settings from "./pages/dashboard/Settings";
import Orders from "./pages/dashboard/Orders";
import Profile from "./pages/Profile";
import AllStores from "./pages/AllStores";
import RootPage from "./pages/RootPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootPage />,
	},
	{
		path: "/dashboard",
		element: <DashboardLayout />,
		children: [
			{
				index: true,
				element: <Home />
			},
			{
				path: "products",
				element: <Products />
			},
			{
				path: "customers",
				element: <Customers />
			},
			{
				path: "settings",
				element: <Settings />
			},
			{
				path: "orders",
				element: <Orders />
			},
			{
				path: "profile",
				element: <Profile />
			},
			{
				path: "stores",
				element: <AllStores />
			}
		]
	},
	{
		element: <AuthLayout />,
		children: [
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/register",
				element: <Register />,
			},
			{
				path:"/new-store",
				element: <NewStore />
			}
		],
	}
]);

function App() {
  return (
    <Fragment>
      <OnchainProviders>
        <Toaster />
        <RouterProvider router={router} />
      </OnchainProviders>
    </Fragment>
  );
}

export default App;
