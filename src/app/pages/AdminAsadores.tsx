import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NavbarAdmin } from "../components/NavbarAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ChefHat, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  obtenerMaestrosAprobados,
  type MaestroPendiente,
} from "../services/adminApi";
import { toast } from "sonner";

export function AdminAsadores() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [asadores, setAsadores] = useState<MaestroPendiente[]>([]);
  const [cargando, setCargando] = useState(true);

  const rol = user?.user_metadata?.rol ?? "usuario";

  useEffect(() => {
    if (loading) return;
    if (!user || rol !== "admin") navigate("/dashboard");
  }, [user, loading, rol, navigate]);

  useEffect(() => {
    if (loading || !user || rol !== "admin") return;
    obtenerMaestrosAprobados()
      .then(setAsadores)
      .catch(() => toast.error("Error cargando asadores"))
      .finally(() => setCargando(false));
  }, [user, loading, rol]);

  if (loading || !user) return null;

  const disponibles = asadores.filter((a) => a.disponibilidad);
  const noDisponibles = asadores.filter((a) => !a.disponibilidad);

  return (
    <div className="min-h-screen bg-background">
      <NavbarAdmin />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Maestros Asadores</h1>
          <p className="mt-2 text-muted-foreground">
            Catálogo de asadores aprobados y su disponibilidad actual.
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-full bg-primary/10 p-3">
                <ChefHat className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total aprobados</p>
                <p className="text-2xl font-bold">{cargando ? "—" : asadores.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-full bg-green-100 p-3">
                <ChefHat className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Disponibles</p>
                <p className="text-2xl font-bold">{cargando ? "—" : disponibles.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-full bg-muted p-3">
                <ChefHat className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">No disponibles</p>
                <p className="text-2xl font-bold">{cargando ? "—" : noDisponibles.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Todos los asadores aprobados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cargando ? (
              <p className="text-sm text-muted-foreground italic">Cargando...</p>
            ) : asadores.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No hay asadores aprobados aún.</p>
            ) : (
              <div className="space-y-3">
                {asadores.map((a) => (
                  <div
                    key={a.idMaestro}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{a.nombre} {a.apellido}</p>
                        <Badge variant={a.disponibilidad ? "default" : "secondary"}>
                          {a.disponibilidad ? "Disponible" : "No disponible"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{a.correo} · {a.telefono}</p>
                      {a.descripcion && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{a.descripcion}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0 ml-4 space-y-1">
                      <p className="font-semibold text-primary">
                        ${(a.valorServicio ?? 0).toLocaleString("es-CL")}
                      </p>
                      <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{a.puntuacion ?? 0}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{a.experienciaAnos} años exp.</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}