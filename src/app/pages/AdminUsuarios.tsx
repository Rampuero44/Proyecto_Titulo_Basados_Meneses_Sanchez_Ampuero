import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { NavbarAdmin } from "../components/NavbarAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { obtenerMetricasAdmin, type AdminMetricas } from "../services/adminApi";
import { toast } from "sonner";

const ROL_LABEL: Record<string, string> = {
  PARTICIPANTE: "Participante",
  MAESTRO: "Maestro Asador",
  MAESTRO_PENDIENTE: "Maestro Pendiente",
  MAESTRO_RECHAZADO: "Maestro Rechazado",
  admin: "Administrador",
};

const ROL_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PARTICIPANTE: "secondary",
  MAESTRO: "default",
  MAESTRO_PENDIENTE: "outline",
  MAESTRO_RECHAZADO: "destructive",
  admin: "destructive",
};

const MES_LABEL: Record<string, string> = {
  "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr",
  "05": "May", "06": "Jun", "07": "Jul", "08": "Ago",
  "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
};

function formatearMes(mes: string): string {
  const [anio, num] = mes.split("-");
  return `${MES_LABEL[num] ?? num} ${anio}`;
}

export function AdminUsuarios() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [metricas, setMetricas] = useState<AdminMetricas | null>(null);
  const [cargando, setCargando] = useState(true);

  const rol = user?.user_metadata?.rol ?? "usuario";

  useEffect(() => {
    if (loading) return;
    if (!user || rol !== "admin") navigate("/dashboard");
  }, [user, loading, rol, navigate]);

  useEffect(() => {
    if (loading || !user || rol !== "admin") return;
    obtenerMetricasAdmin()
      .then(setMetricas)
      .catch(() => toast.error("Error cargando métricas de usuarios"))
      .finally(() => setCargando(false));
  }, [user, loading, rol]);

  if (loading || !user) return null;

  const maxRol = metricas?.usuariosPorRol.reduce((max, r) => Math.max(max, r.cantidad), 0) ?? 1;
  const maxMes = metricas?.registrosPorMes.reduce((max, r) => Math.max(max, r.cantidad), 0) ?? 1;
  const registrosOrdenados = [...(metricas?.registrosPorMes ?? [])].reverse();

  return (
    <div className="min-h-screen bg-background">
      <NavbarAdmin />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="mt-2 text-muted-foreground">Análisis de la base de usuarios registrados en BASADOS.</p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-full bg-primary/10 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total usuarios</p>
                <p className="text-2xl font-bold">{cargando ? "—" : metricas?.totalUsuarios ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-full bg-green-100 p-3">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold">{cargando ? "—" : metricas?.usuariosActivos ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="rounded-full bg-amber-100 p-3">
                <UserX className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactivos</p>
                <p className="text-2xl font-bold">{cargando ? "—" : metricas?.usuariosInactivos ?? 0}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Distribución por rol
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cargando ? (
                <p className="text-sm text-muted-foreground italic">Cargando...</p>
              ) : !metricas?.usuariosPorRol.length ? (
                <p className="text-sm text-muted-foreground italic">Sin datos</p>
              ) : (
                <div className="space-y-3">
                  {metricas.usuariosPorRol.map((r) => (
                    <div key={r.rol}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant={ROL_VARIANT[r.rol] ?? "secondary"}>
                            {ROL_LABEL[r.rol] ?? r.rol}
                          </Badge>
                        </div>
                        <span className="font-medium">{r.cantidad}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(r.cantidad / maxRol) * 100}%` }}
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
                <TrendingUp className="h-5 w-5" />
                Registros por mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cargando ? (
                <p className="text-sm text-muted-foreground italic">Cargando...</p>
              ) : !registrosOrdenados.length ? (
                <p className="text-sm text-muted-foreground italic">Sin datos de registro</p>
              ) : (
                <div className="space-y-3">
                  {registrosOrdenados.map((r) => (
                    <div key={r.mes}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>{formatearMes(r.mes)}</span>
                        <Badge variant="secondary">{r.cantidad}</Badge>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(r.cantidad / maxMes) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}