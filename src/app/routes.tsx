import { createBrowserRouter } from "react-router";
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
import { InscripcionAsador } from "./pages/InscripcionAsador";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";

export const router = createBrowserRouter([
  { index: true, Component: Home },
  { path: "login", Component: Login },
  { path: "register", Component: Register },
  { path: "create-event", Component: CreateEvent },
  { path: "inscripcion-asador", Component: InscripcionAsador },
  {
    Component: ProtectedRoute,
    children: [
      { path: "dashboard", Component: Dashboard },
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
]);