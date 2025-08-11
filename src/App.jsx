import { createBrowserRouter, RouterProvider } from "react-router-dom";

import React, { Children } from "react";
import ReactDOM from "react-dom/client";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";
import supabase from "../supabase-client";
import Income from "./pages/Income"
import Expense from "./pages/Expense";
import Layout from "./components/layouts/Layout";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Layout/>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />, 
      },
      {
        path: "income",
        element: <Income />, 
      },
      {
        path: "expense",
        element: <Expense />,
      },
      {
        path: "profile",
        element: <Profile/>,
      },
    ],
  },
  {
    path:"*",
    element:<NotFound/>
  },
]);


function App() {
    window.supabase = supabase;
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
