import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { LogOut, Users, BarChart3, Shield, Home, ChefHat } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { useAuth } from "../context/AuthContext";

export function NavbarAdmin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">

        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-3">
            <img
              src="/logo-basados.jpg"
              alt="BASADOS"
              className="w-9 h-9 rounded-lg object-cover"
            />
            <span className="text-xl font-semibold">BASADOS</span>
          </Link>
          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
            <Shield className="h-3 w-3" />
            Panel Admin
          </Badge>
        </div>

        <nav className="flex items-center gap-1">
          <Button
            variant={isActive("/admin") ? "secondary" : "ghost"}
            asChild
          >
            <Link to="/admin" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Estadísticas
            </Link>
          </Button>

          <Button
            variant={isActive("/admin/usuarios") ? "secondary" : "ghost"}
            asChild
          >
            <Link to="/admin/usuarios" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </Link>
          </Button>

          <Button
            variant={isActive("/admin/asadores") ? "secondary" : "ghost"}
            asChild
          >
            <Link to="/admin/asadores" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Asadores
            </Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Ver app
            </Link>
          </Button>

          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 ml-2">
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </nav>

      </div>
    </header>
  );
}