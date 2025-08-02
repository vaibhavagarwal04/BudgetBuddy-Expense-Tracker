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


const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,
    },{
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <Dashboard/>
            </PrivateRoute>
        ),
        children:[
            {path:"income",element:<Income/>},
            {path:"expense",element:<Expense/>}
        ]
    },{
        path:"/login",
        element:<Login/>,
    }
    ,{
        path:"/signup",
        element:<SignUp/>,
    }
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
