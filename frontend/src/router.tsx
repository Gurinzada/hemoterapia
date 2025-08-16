import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login/Login";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login/>,
    }
])