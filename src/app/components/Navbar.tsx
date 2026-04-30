import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { LogOut, User, Shield } from "lucide-react";
import { storage } from "../utils/localStorage";
import { toast } from "sonner";
import { Badge } from "./ui/badge";

export function Navbar() {
  const navigate = useNavigate();
  const currentUsuario = storage.getCurrentUsuario();

  const handleLogout = () => {
    storage.setCurrentUsuario(null);
    toast.success("Sesión cerrada");
    navigate("/");
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto max-w-7xl">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo-basados.jpg" alt="BASADOS" className="w-10 h-10 rounded-lg object-cover" />
          <span className="text-xl font-semibold">BASADOS</span>
        </Link>

        <nav className="flex items-center gap-4">
          {currentUsuario?.rol === 'admin' && (
            <Button variant="ghost" asChild>
              <Link to="/admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            </Button>
          )}
          {currentUsuario && (
            <>
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Mis Eventos</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/price-comparison">Comparador</Link>
              </Button>
            </>
          )}

          {currentUsuario ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Perfil
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout} className="hidden sm:inline-flex">
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
