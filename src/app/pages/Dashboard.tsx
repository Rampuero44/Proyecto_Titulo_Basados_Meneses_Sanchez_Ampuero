import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar, Users, Plus, Trash2, Eye } from "lucide-react";
import { storage, Evento, Usuario } from "../utils/localStorage";
import { toast } from "sonner";
import { formatearFecha } from "../utils/format";

export function Dashboard() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [currentUsuario, setCurrentUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const usuario = storage.getCurrentUsuario();

    if (!usuario) {
      navigate("/login");
      return;
    }

    setCurrentUsuario(usuario);
    setEventos(storage.getUsuarioEventos(usuario.id));
  }, [navigate]);

  const handleDeleteEvento = (eventoId: number) => {
    if (!currentUsuario) return;

    if (window.confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      storage.deleteEvento(eventoId);
      setEventos(storage.getUsuarioEventos(currentUsuario.id));
      toast.success("Evento eliminado");
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      planificado: "secondary",
      confirmado: "default",
      finalizado: "outline",
    };
    return (
      <Badge variant={variants[estado] || "default"}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    );
  };

  if (!currentUsuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mis Eventos</h1>
            <p className="text-muted-foreground mt-2">
              Organiza y gestiona tus asados
            </p>
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
              <Card
                key={evento.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/event/${evento.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="line-clamp-1">{evento.nombre}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvento(evento.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatearFecha(evento.fecha)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{evento.participantes.length} participantes</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    {getEstadoBadge(evento.estado)}
                    <span className="text-sm font-semibold">
                      ${evento.presupuesto.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/event/${evento.id}`);
                    }}
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
    </div>
  );
}
