import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { LogOut, Users, BarChart3, Shield, Home } from "lucide-react";
import { storage } from "../utils/localStorage";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

export function NavbarAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.setCurrentUsuario(null);
    toast.success("Sesión cerrada");
    navigate("/");
  };

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

        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/admin" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Estadísticas
            </Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link to="/admin" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link to="/dashboard" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Ver app
            </Link>
          </Button>

          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </nav>

      </div>
    </header>
  );
}