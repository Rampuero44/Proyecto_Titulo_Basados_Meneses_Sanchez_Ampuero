import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar, Users, Plus, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { formatearFecha, formatPrice } from "../utils/format";
import { useAuth } from "../context/AuthContext";
import { obtenerEventosPorUsuario, eliminarEvento } from "../services/eventosApi";
import { EventoResponse } from "../types/evento";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useConfirm } from "../hooks/useConfirm";

export function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [eventos, setEventos] = useState<EventoResponse[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (loading) return;

    obtenerEventosPorUsuario(user!.id)
      .then(setEventos)
      .catch(() => toast.error("Error cargando eventos"))
      .finally(() => setCargando(false));
  }, [user, loading]);

  const { confirm, open, options, handleConfirm, handleCancel } = useConfirm();

  const handleDeleteEvento = async (idEvento: string) => {
    const confirmado = await confirm({
      title: "Eliminar evento",
      description: "¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
    });
    if (!confirmado) return;
    try {
      await eliminarEvento(idEvento);
      setEventos((prev) => prev.filter((e) => e.id !== idEvento));
      toast.success("Evento eliminado");
    } catch {
      toast.error("Error eliminando evento");
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      BORRADOR: "secondary",
      PLANIFICANDO: "secondary",
      CONFIRMADO: "default",
      FINALIZADO: "outline",
    };
    return (
      <Badge variant={variants[estado] || "default"}>
        {estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase()}
      </Badge>
    );
  };

  if (loading || cargando) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mis Eventos</h1>
            <p className="text-muted-foreground mt-2">Organiza y gestiona tus asados</p>
          </div>
          <Button onClick={() => navigate("/create-event")}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Evento
          </Button>
        </div>

        {eventos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No tienes eventos aún</h3>
              <p className="text-muted-foreground text-center mb-4">
                Comienza creando tu primer asado
              </p>
              <Button onClick={() => navigate("/create-event")}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Evento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventos.map((evento) => (
              <Card key={evento.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-1">{evento.nombre}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); handleDeleteEvento(evento.id); }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {evento.fechaEvento ? formatearFecha(evento.fechaEvento) : "Sin fecha"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{evento.cantidadPersonas ?? 0} participantes</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    {getEstadoBadge(evento.estado ?? "BORRADOR")}
                    <span className="text-sm font-semibold">
                      {formatPrice(evento.presupuesto ?? 0)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/event/${evento.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver detalle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <ConfirmDialog
        open={open}
        title={options.title}
        description={options.description}
        confirmLabel={options.confirmLabel}
        cancelLabel={options.cancelLabel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
