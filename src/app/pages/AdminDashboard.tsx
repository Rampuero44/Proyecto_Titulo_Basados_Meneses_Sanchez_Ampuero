import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NavbarAdmin } from "../components/NavbarAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ExternalLink, BarChart2, Users, ShoppingBag, CalendarCheck, ChefHat, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  obtenerMetricasAdmin,
  obtenerMaestrosPendientes,
  obtenerMaestrosAprobados,
  obtenerMaestrosRechazados,
  aprobarMaestro,
  rechazarMaestro,
  revocarMaestro,
  type AdminMetricas,
  type MaestroPendiente,
} from "../services/adminApi";
import { toast } from "sonner";

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
  const [pendientes, setPendientes] = useState<MaestroPendiente[]>([]);
  const [aprobados, setAprobados] = useState<MaestroPendiente[]>([]);
  const [rechazados, setRechazados] = useState<MaestroPendiente[]>([]);
  const [cargandoMaestros, setCargandoMaestros] = useState(true);

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

    cargarTodosMaestros();
  }, [user, loading, rol]);

  async function cargarTodosMaestros() {
    setCargandoMaestros(true);
    try {
      const [p, a, r] = await Promise.all([
        obtenerMaestrosPendientes(),
        obtenerMaestrosAprobados(),
        obtenerMaestrosRechazados(),
      ]);
      setPendientes(p);
      setAprobados(a);
      setRechazados(r);
    } catch {
      toast.error("Error cargando maestros");
    } finally {
      setCargandoMaestros(false);
    }
  }

  async function handleAprobar(id: number) {
    try {
      await aprobarMaestro(id);
      toast.success("Maestro aprobado correctamente");
      cargarTodosMaestros();
    } catch {
      toast.error("Error al aprobar maestro");
    }
  }

  async function handleRechazar(id: number) {
    try {
      await rechazarMaestro(id);
      toast.success("Solicitud rechazada");
      cargarTodosMaestros();
    } catch {
      toast.error("Error al rechazar solicitud");
    }
  }

  async function handleRevocar(id: number) {
    try {
      await revocarMaestro(id);
      toast.success("Aprobación revocada, maestro vuelve a pendiente");
      cargarTodosMaestros();
    } catch {
      toast.error("Error al revocar aprobación");
    }
  }

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

        {/* Tarjetas resumen */}
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
                <ChefHat className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maestros pendientes</p>
                <p className="text-2xl font-bold">
                  {cargandoMaestros ? "—" : pendientes.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maestros asadores — pestañas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Gestión de Maestros Asadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pendientes">
              <TabsList className="mb-4">
                <TabsTrigger value="pendientes">
                  Pendientes
                  {pendientes.length > 0 && (
                    <Badge variant="secondary" className="ml-2">{pendientes.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="aprobados">
                  Aprobados
                  {aprobados.length > 0 && (
                    <Badge variant="default" className="ml-2">{aprobados.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="rechazados">
                  Rechazados
                  {rechazados.length > 0 && (
                    <Badge variant="outline" className="ml-2">{rechazados.length}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* PENDIENTES */}
              <TabsContent value="pendientes">
                {cargandoMaestros ? (
                  <p className="text-sm text-muted-foreground italic">Cargando...</p>
                ) : pendientes.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No hay solicitudes pendientes.</p>
                ) : (
                  <div className="space-y-4">
                    {pendientes.map((m) => (
                      <div key={m.idMaestro} className="rounded-lg border p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{m.nombre} {m.apellido}</p>
                            <p className="text-sm text-muted-foreground">{m.correo} · {m.telefono}</p>
                          </div>
                          <Badge variant="secondary">Pendiente</Badge>
                        </div>
                        <p className="text-sm">{m.descripcion}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span>{m.experienciaAnos} años de experiencia</span>
                          <span>·</span>
                          <span>Tarifa: ${(m.valorServicio ?? 0).toLocaleString("es-CL")}</span>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button size="sm" onClick={() => handleAprobar(m.idMaestro)}>
                            <CheckCircle className="mr-1 h-4 w-4" /> Aprobar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRechazar(m.idMaestro)}>
                            <XCircle className="mr-1 h-4 w-4" /> Rechazar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* APROBADOS */}
              <TabsContent value="aprobados">
                {cargandoMaestros ? (
                  <p className="text-sm text-muted-foreground italic">Cargando...</p>
                ) : aprobados.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No hay maestros aprobados aún.</p>
                ) : (
                  <div className="space-y-4">
                    {aprobados.map((m) => (
                      <div key={m.idMaestro} className="rounded-lg border p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{m.nombre} {m.apellido}</p>
                            <p className="text-sm text-muted-foreground">{m.correo} · {m.telefono}</p>
                          </div>
                          <Badge variant="default">Aprobado</Badge>
                        </div>
                        <p className="text-sm">{m.descripcion}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span>{m.experienciaAnos} años de experiencia</span>
                          <span>·</span>
                          <span>Tarifa: ${(m.valorServicio ?? 0).toLocaleString("es-CL")}</span>
                          <span>·</span>
                          <span>Puntuación: {m.puntuacion ?? 0}</span>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button size="sm" variant="outline" onClick={() => handleRevocar(m.idMaestro)}>
                            <RotateCcw className="mr-1 h-4 w-4" /> Revocar aprobación
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* RECHAZADOS */}
              <TabsContent value="rechazados">
                {cargandoMaestros ? (
                  <p className="text-sm text-muted-foreground italic">Cargando...</p>
                ) : rechazados.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No hay solicitudes rechazadas.</p>
                ) : (
                  <div className="space-y-4">
                    {rechazados.map((m) => (
                      <div key={m.idMaestro} className="rounded-lg border p-4 space-y-2 opacity-75">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{m.nombre} {m.apellido}</p>
                            <p className="text-sm text-muted-foreground">{m.correo} · {m.telefono}</p>
                          </div>
                          <Badge variant="outline">Rechazado</Badge>
                        </div>
                        <p className="text-sm">{m.descripcion}</p>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <span>{m.experienciaAnos} años de experiencia</span>
                          <span>·</span>
                          <span>Tarifa: ${(m.valorServicio ?? 0).toLocaleString("es-CL")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Gráficos */}
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
            <Button onClick={() => window.open("https://supabase.com/dashboard", "_blank")}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir Supabase Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
