import { createBrowserRouter, RouterProvider } from "react-router-dom";

import React, { Children } from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";



const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,
    },{
        path: "/dashboard",
        element: <Dashboard/>,
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
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
