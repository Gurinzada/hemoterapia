import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import PrivateRoute from "./components/privateRouter/PrivateRoute";
import Client from "./pages/clients/Client";
import Schedule from "./pages/schedule/Schedule";
import Admin from "./pages/admin/Admin";

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
  },
  {
    path: "/appoitments",
    element: (
      <PrivateRoute>
        <Schedule/>
      </PrivateRoute>
    )
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <Admin/>
      </PrivateRoute>
    )
  }
]);
