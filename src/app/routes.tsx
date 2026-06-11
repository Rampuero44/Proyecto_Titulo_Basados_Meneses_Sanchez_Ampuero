import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { CreateEvent } from "./pages/CreateEvent";
import { EventDetail } from "./pages/EventDetail";
import { AdminDashboard } from "./pages/AdminDashboard";
import { NotFound } from "./pages/NotFound";
import { Profile } from "./pages/Profile";
import { SeleccionServicio } from "./pages/SeleccionServicio";
import { ContratarAsador } from "./pages/ContratarAsador";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      {
        Component: ProtectedRoute,
        children: [
          { path: "dashboard", Component: Dashboard },
          { path: "create-event", Component: CreateEvent },
          { path: "event/:id", Component: EventDetail },
          { path: "profile", Component: Profile },
          { path: "seleccion-servicio", Component: SeleccionServicio },
          { path: "contratar-asador", Component: ContratarAsador },
        ],
      },
      {
        Component: AdminRoute,
        children: [
          { path: "admin", Component: AdminDashboard },
        ],
      },
      { path: "*", Component: NotFound },
    ],
  },
]);
