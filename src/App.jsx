import { createBrowserRouter, RouterProvider } from "react-router";

import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Loign from "./pages/Login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,
    },
    {
    },
]);

function App() {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
