import { useEffect } from "react";
import { useNavigate } from "react-router";
import { NavbarAdmin } from "../components/NavbarAdmin";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { storage } from "../utils/localStorage";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  UserCheck, 
  Beef,
  Activity,
  BarChart3,
  ArrowLeft
} from "lucide-react";

interface Statistics {
  totalUsuarios: number;
  totalEventos: number;
  totalParticipantes: number;
  totalPresupuesto: number;
  presupuestoPromedio: number;
  participantesPromedio: number;
  eventosPorEstado: {
    planificado: number;
    confirmado: number;
    finalizado: number;
  };
  topUsuarios: { nombre: string; email: string; cantidadEventos: number }[];
  actividadMensual: { mes: string; cantidad: number }[];
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const currentUsuario = storage.getCurrentUsuario();

  useEffect(() => {
    if (!currentUsuario || currentUsuario.rol !== 'admin') {
      navigate("/login");
    }
  }, [currentUsuario, navigate]);

  const calcularEstadisticas = (): Statistics => {
    const usuarios = storage.getUsuarios();
    const eventos = storage.getEventos();

    const totalUsuarios = usuarios.length;
    const totalEventos = eventos.length;

    const todosParticipantes = eventos.flatMap(e => e.participantes);
    const totalParticipantes = todosParticipantes.length;

    const eventosPorEstado = {
      planificado: eventos.filter(e => e.estado === "planificado").length,
      confirmado: eventos.filter(e => e.estado === "confirmado").length,
      finalizado: eventos.filter(e => e.estado === "finalizado").length,
    };

    const totalPresupuesto = eventos.reduce((sum, e) => sum + e.presupuesto, 0);
    const presupuestoPromedio = totalEventos > 0 ? totalPresupuesto / totalEventos : 0;
    const participantesPromedio = totalEventos > 0 ? totalParticipantes / totalEventos : 0;

    // Top usuarios
    const usuarioEventosMap = new Map<number, { nombre: string; email: string; cantidad: number }>();
    
    eventos.forEach(evento => {
      const usuario = usuarios.find(u => u.id === evento.usuarioId);
      if (usuario) {
        const actual = usuarioEventosMap.get(usuario.id);
        if (actual) {
          actual.cantidad++;
        } else {
          usuarioEventosMap.set(usuario.id, {
            nombre: usuario.nombre,
            email: usuario.email,
            cantidad: 1,
          });
        }
      }
    });

    const topUsuarios = Array.from(usuarioEventosMap.values())
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5)
      .map(u => ({ nombre: u.nombre, email: u.email, cantidadEventos: u.cantidad }));

    // Actividad mensual
    const actividadMensual: { mes: string; cantidad: number }[] = [];
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const ahora = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      const nombreMes = meses[fecha.getMonth()];
      const cantidad = eventos.filter(e => {
        const eventoFecha = new Date(e.createdAt);
        return eventoFecha.getMonth() === fecha.getMonth() && 
               eventoFecha.getFullYear() === fecha.getFullYear();
      }).length;
      actividadMensual.push({ mes: nombreMes, cantidad });
    }

    return {
      totalUsuarios,
      totalEventos,
      totalParticipantes,
      totalPresupuesto,
      presupuestoPromedio,
      participantesPromedio,
      eventosPorEstado,
      topUsuarios,
      actividadMensual,
    };
  };

  const stats = calcularEstadisticas();

  if (!currentUsuario || currentUsuario.rol !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavbarAdmin />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Dashboard
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Activity className="h-6 w-6 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Administrador</h1>
          </div>
          <p className="text-muted-foreground">
            Estadísticas y métricas de uso de BASADOS
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Usuarios registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEventos}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Eventos creados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participantes</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalParticipantes}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Promedio: {stats.participantesPromedio.toFixed(1)} por evento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalPresupuesto.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Promedio: ${Math.round(stats.presupuestoPromedio).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Eventos por Estado */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Eventos por Estado
              </CardTitle>
              <CardDescription>Distribución según estado actual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm">Planificados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.eventosPorEstado.planificado}</span>
                    <Badge variant="outline">
                      {stats.totalEventos > 0 
                        ? Math.round((stats.eventosPorEstado.planificado / stats.totalEventos) * 100)
                        : 0}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all" 
                    style={{ 
                      width: `${stats.totalEventos > 0 ? (stats.eventosPorEstado.planificado / stats.totalEventos) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-500" />
                    <span className="text-sm">Confirmados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.eventosPorEstado.confirmado}</span>
                    <Badge variant="outline">
                      {stats.totalEventos > 0 
                        ? Math.round((stats.eventosPorEstado.confirmado / stats.totalEventos) * 100)
                        : 0}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all" 
                    style={{ 
                      width: `${stats.totalEventos > 0 ? (stats.eventosPorEstado.confirmado / stats.totalEventos) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Finalizados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{stats.eventosPorEstado.finalizado}</span>
                    <Badge variant="outline">
                      {stats.totalEventos > 0 
                        ? Math.round((stats.eventosPorEstado.finalizado / stats.totalEventos) * 100)
                        : 0}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all" 
                    style={{ 
                      width: `${stats.totalEventos > 0 ? (stats.eventosPorEstado.finalizado / stats.totalEventos) * 100 : 0}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actividad Mensual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Actividad Mensual
              </CardTitle>
              <CardDescription>Eventos creados en los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.actividadMensual.map((mes) => (
                  <div key={mes.mes} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{mes.mes}</span>
                      <span className="text-sm text-muted-foreground">{mes.cantidad}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ 
                          width: `${stats.totalEventos > 0 ? (mes.cantidad / Math.max(...stats.actividadMensual.map(m => m.cantidad), 1)) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Usuarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Usuarios Más Activos
            </CardTitle>
            <CardDescription>Top 5 organizadores de eventos</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topUsuarios.length > 0 ? (
              <div className="space-y-4">
                {stats.topUsuarios.map((usuario, index) => (
                  <div key={usuario.email} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{usuario.nombre}</p>
                        <p className="text-xs text-muted-foreground">{usuario.email}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {usuario.cantidadEventos} {usuario.cantidadEventos === 1 ? "evento" : "eventos"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay datos disponibles aún
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
