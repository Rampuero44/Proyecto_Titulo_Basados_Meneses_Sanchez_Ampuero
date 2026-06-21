import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NavbarAdmin } from "../components/NavbarAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { ExternalLink, BarChart2, Users, ShoppingBag, CalendarCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { obtenerMetricasAdmin, type AdminMetricas } from "../services/adminApi";

const ESTADO_LABEL: Record<string, string> = {
  BORRADOR: "Borrador",
  PLANIFICACION: "Planificación",
  PLANIFICANDO: "Planificando",
  CONFIRMADO: "Confirmado",
  FINALIZADO: "Finalizado",
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [metricas, setMetricas] = useState<AdminMetricas | null>(null);
  const [errorMetricas, setErrorMetricas] = useState<string | null>(null);
  const [cargandoMetricas, setCargandoMetricas] = useState(true);

  const rol = user?.user_metadata?.rol ?? "usuario";

  useEffect(() => {
    if (loading) return;
    if (!user || rol !== "admin") {
      navigate("/dashboard");
    }
  }, [user, loading, rol, navigate]);

  useEffect(() => {
    if (loading || !user || rol !== "admin") return;
    obtenerMetricasAdmin()
      .then(setMetricas)
      .catch((err) => setErrorMetricas(err.message))
      .finally(() => setCargandoMetricas(false));
  }, [user, loading, rol]);

  if (loading || !user) return null;

  const totalEventos = metricas?.eventosPorEstado.reduce((sum, e) => sum + e.cantidad, 0) ?? 0;
  const maxProducto = metricas?.productosMasSeleccionados[0]?.vecesSeleccionado ?? 1;
  const maxEstado = metricas?.eventosPorEstado.reduce((max, e) => Math.max(max, e.cantidad), 0) ?? 1;

  return (
    <div className="min-h-screen bg-background">
      <NavbarAdmin />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
          <p className="mt-2 text-muted-foreground">
            Gestión y business intelligence del sistema Basados.
          </p>
        </div>

        {errorMetricas && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive">{errorMetricas}</p>
            </CardContent>
          </Card>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuarios registrados</p>
                <p className="text-2xl font-bold">
                  {cargandoMetricas ? "—" : metricas?.totalUsuarios ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-full bg-primary/10 p-3">
                <CalendarCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eventos totales</p>
                <p className="text-2xl font-bold">
                  {cargandoMetricas ? "—" : totalEventos}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-full bg-primary/10 p-3">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productos en ranking</p>
                <p className="text-2xl font-bold">
                  {cargandoMetricas ? "—" : metricas?.productosMasSeleccionados.length ?? 0}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck className="h-5 w-5" />
                Eventos por estado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cargandoMetricas ? (
                <p className="text-sm text-muted-foreground italic">Cargando...</p>
              ) : !metricas?.eventosPorEstado.length ? (
                <p className="text-sm text-muted-foreground italic">Sin eventos registrados</p>
              ) : (
                <div className="space-y-3">
                  {metricas.eventosPorEstado.map((e) => (
                    <div key={e.estado}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>{ESTADO_LABEL[e.estado] ?? e.estado}</span>
                        <Badge variant="secondary">{e.cantidad}</Badge>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(e.cantidad / maxEstado) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Productos más seleccionados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cargandoMetricas ? (
                <p className="text-sm text-muted-foreground italic">Cargando...</p>
              ) : !metricas?.productosMasSeleccionados.length ? (
                <p className="text-sm text-muted-foreground italic">Sin datos disponibles aún</p>
              ) : (
                <div className="space-y-3">
                  {metricas.productosMasSeleccionados.map((p, i) => (
                    <div key={p.nombre}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="truncate">{i + 1}. {p.nombre}</span>
                        <Badge variant="outline">{p.vecesSeleccionado}</Badge>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(p.vecesSeleccionado / maxProducto) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Dashboard de Supabase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Accede al dashboard de Supabase para consultar usuarios registrados,
              métricas de la base de datos y logs de autenticación.
            </p>
            <Button
              onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir Supabase Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}