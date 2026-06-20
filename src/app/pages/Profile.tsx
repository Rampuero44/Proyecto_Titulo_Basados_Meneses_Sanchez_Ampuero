import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { CalendarDays, Home, LogOut, Plus, User2, ShieldCheck, ShieldX, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { obtenerEventosPorUsuario } from "../services/eventosApi";
import { calcularEdad } from "../utils/age";

export function Profile() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [cantidadEventos, setCantidadEventos] = useState(0);
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");

  const nombre = user?.user_metadata?.nombre ?? user?.email ?? "Usuario";
  const email = user?.email ?? "";
  const fechaNacimiento = user?.user_metadata?.fecha_nacimiento ?? null;
  const edad = fechaNacimiento ? calcularEdad(fechaNacimiento) : null;
  const esMayor = edad !== null ? edad >= 18 : null;
  const rol = user?.user_metadata?.rol ?? "usuario";

  useEffect(() => {
    if (loading) return;
    setNuevoNombre(nombre);
    obtenerEventosPorUsuario(user!.id)
      .then((eventos) => setCantidadEventos(eventos.length))
      .catch(() => {});
  }, [user, loading, nombre]);

  const handleLogout = async () => {
    await logout();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Mi perfil</h1>
          <p className="mt-2 text-muted-foreground">Información de tu cuenta y acciones rápidas.</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User2 className="h-5 w-5" />
                Datos personales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nombre</p>
                {editandoNombre ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={nuevoNombre}
                      onChange={(e) => setNuevoNombre(e.target.value)}
                      className="h-8 max-w-xs"
                      onKeyDown={(e) => e.key === "Enter" && setEditandoNombre(false)}
                    />
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditandoNombre(false)}>
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditandoNombre(false); setNuevoNombre(nombre); }}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{nombre}</p>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditandoNombre(true)}>
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Correo electrónico</p>
                <p className="font-medium">{email}</p>
              </div>

              <Separator />

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Fecha de nacimiento</p>
                {fechaNacimiento ? (
                  <div className="flex items-center gap-3">
                    <p className="font-medium">
                      {new Date(fechaNacimiento).toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" })}
                    </p>
                    <span className="text-sm text-muted-foreground">({edad} años)</span>
                    {esMayor ? (
                      <Badge className="gap-1 bg-green-100 text-green-800 hover:bg-green-100">
                        <ShieldCheck className="h-3 w-3" /> Mayor de edad
                      </Badge>
                    ) : (
                      <Badge className="gap-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
                        <ShieldX className="h-3 w-3" /> Menor de edad · alcohol restringido
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No registrada</p>
                )}
              </div>

              <Separator />

              <div className="flex items-center gap-8">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Rol</p>
                  <Badge variant={rol === "admin" ? "destructive" : "secondary"}>
                    {rol === "admin" ? "Administrador" : "Usuario"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Eventos creados</p>
                  <p className="font-medium text-lg">{cantidadEventos}</p>
                </div>
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Acciones rápidas</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Button onClick={() => navigate("/dashboard")} className="justify-start">
                <CalendarDays className="mr-2 h-4 w-4" /> Mis eventos
              </Button>
              <Button variant="outline" onClick={() => navigate("/create-event")} className="justify-start">
                <Plus className="mr-2 h-4 w-4" /> Crear nuevo evento
              </Button>
              <Button variant="outline" onClick={() => navigate("/")} className="justify-start">
                <Home className="mr-2 h-4 w-4" /> Volver al inicio
              </Button>
              <Button variant="destructive" onClick={handleLogout} className="justify-start sm:col-span-2">
                <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
