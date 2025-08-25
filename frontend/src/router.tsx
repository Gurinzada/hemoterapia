import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import PrivateRoute from "./components/privateRouter/PrivateRoute";
import Client from "./pages/clients/Client";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: (
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    ),
  },
  {
    path: "/clients",
    element: (
      <PrivateRoute>
        <Client/>
      </PrivateRoute>
    )
  }
]);
