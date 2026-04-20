import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { CreateEvent } from "./pages/CreateEvent";
import { EventDetail } from "./pages/EventDetail";
import { PriceComparison } from "./pages/PriceComparison";
import { AdminDashboard } from "./pages/AdminDashboard";
import { NotFound } from "./pages/NotFound";
import { Profile } from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "dashboard", Component: Dashboard },
      { path: "admin", Component: AdminDashboard },
      { path: "create-event", Component: CreateEvent },
      { path: "event/:id", Component: EventDetail },
      { path: "price-comparison", Component: PriceComparison },
      { path: "profile", Component: Profile },
      { path: "*", Component: NotFound },
    ],
  },
]);
