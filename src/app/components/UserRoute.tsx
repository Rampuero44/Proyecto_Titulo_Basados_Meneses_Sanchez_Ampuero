import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export function UserRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const rol = user.user_metadata?.rol ?? "usuario";
  if (rol === "admin") return <Navigate to="/admin" replace />;

  return <Outlet />;
}
