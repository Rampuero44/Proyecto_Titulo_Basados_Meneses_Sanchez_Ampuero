import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { storage } from "../utils/localStorage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { CalendarDays, Home, LogOut, Plus, User2 } from "lucide-react";
import { toast } from "sonner";

export function Profile() {
  const navigate = useNavigate();
  const currentUsuario = storage.getCurrentUsuario();

  useEffect(() => {
    if (!currentUsuario) {
      navigate("/login");
    }
  }, [currentUsuario, navigate]);

  if (!currentUsuario) {
    return null;
  }

  const cantidadEventos = storage.getUsuarioEventos(currentUsuario.id).length;

  const handleLogout = () => {
    storage.setCurrentUsuario(null);
    toast.success("Sesión cerrada");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Perfil de {currentUsuario.nombre}</h1>
          <p className="mt-2 text-muted-foreground">Accede rápido a las acciones principales de tu cuenta demo.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User2 className="h-5 w-5" />
                Datos de la cuenta
              </CardTitle>
              <CardDescription>Resumen del usuario actual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{currentUsuario.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Correo</p>
                <p className="font-medium">{currentUsuario.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Rol</p>
                  <Badge variant={currentUsuario.rol === "admin" ? "destructive" : "secondary"}>
                    {currentUsuario.rol === "admin" ? "Administrador" : "Usuario"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Eventos creados</p>
                  <p className="font-medium">{cantidadEventos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones rápidas</CardTitle>
              <CardDescription>Botones directos para que la demo fluya sin tropiezos</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button onClick={() => navigate("/dashboard")} className="justify-start">
                <CalendarDays className="mr-2 h-4 w-4" />
                Ir a Mis Eventos
              </Button>
              <Button variant="outline" onClick={() => navigate("/create-event")} className="justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Crear nuevo evento
              </Button>
              <Button variant="outline" onClick={() => navigate("/price-comparison")} className="justify-start">
                <CalendarDays className="mr-2 h-4 w-4" />
                Ver comparador
              </Button>
              <Button variant="outline" onClick={() => navigate("/")} className="justify-start">
                <Home className="mr-2 h-4 w-4" />
                Volver al inicio
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="justify-start">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
