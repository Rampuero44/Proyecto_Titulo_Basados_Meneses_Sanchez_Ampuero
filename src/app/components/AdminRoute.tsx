import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export function AdminRoute() {
  const { user, perfil, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (perfil === null) return null;
  if (perfil.rol !== "admin") return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}