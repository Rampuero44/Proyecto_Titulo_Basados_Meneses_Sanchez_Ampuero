import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { ArrowLeft, Star, Phone, Mail, UserCheck, X } from "lucide-react";
import { MaestroParrillero, obtenerMaestros } from "../services/asadoresApi";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { formatPrice } from "../utils/format";
import { crearContratacion } from "../services/contratacionesApi";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star key={star} className={`size-4 ${star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
    ))}
    <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
  </div>
);

export function ContratarAsador() {
  const navigate = useNavigate();
  const [asadorSeleccionado, setAsadorSeleccionado] = useState<MaestroParrillero | null>(null);
  const [expandido, setExpandido] = useState<number | null>(null);
  const [maestros, setMaestros] = useState<MaestroParrillero[]>([]);
  const [cargando, setCargando] = useState(true);
  const [contratando, setContratando] = useState(false);

  useEffect(() => {
    obtenerMaestros()
      .then(setMaestros)
      .catch(() => toast.error("No se pudieron cargar los maestros asadores"))
      .finally(() => setCargando(false));
  }, []);

  const handleContratar = async () => {
    if (!asadorSeleccionado) {
      toast.error("Selecciona un maestro asador para continuar");
      return;
    }

    setContratando(true);
    try {
      await crearContratacion({
        idMaestro: asadorSeleccionado.idMaestro,
        valorAcordado: asadorSeleccionado.valorServicio,
      });

      toast.success(`¡${asadorSeleccionado.nombre} contratado! Nos pondremos en contacto contigo pronto.`);
      setAsadorSeleccionado(null);
    } catch {
      toast.error("No se pudo registrar la contratación. Intenta nuevamente.");
    } finally {
      setContratando(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/seleccion-servicio")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Maestros Asadores</h1>
          <p className="mt-2 text-muted-foreground">
            Profesionales disponibles para tu evento. Selecciona el que más se adapte.
          </p>
        </div>

        {asadorSeleccionado && (
          <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-4 mb-6">
            <UserCheck className="size-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{asadorSeleccionado.nombre} {asadorSeleccionado.apellido} seleccionado</p>
              <p className="text-sm text-muted-foreground">
                Valor del servicio: {formatPrice(asadorSeleccionado.valorServicio)}
              </p>
            </div>
            <Button size="sm" onClick={handleContratar} disabled={contratando}>
              {contratando ? "Registrando..." : "Confirmar contratación"}
            </Button>
          </div>
        )}

        {cargando && <p className="text-muted-foreground text-sm">Cargando maestros asadores...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {maestros.map((asador) => {
            const seleccionado = asadorSeleccionado?.idMaestro === asador.idMaestro;
            const isExpandido = expandido === asador.idMaestro;

            return (
              <Card key={asador.idMaestro} className={`flex flex-col transition-all ${seleccionado ? "border-primary ring-1 ring-primary" : "hover:shadow-md"}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-xl font-bold shrink-0">
                        {asador.nombre.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-base leading-tight">{asador.nombre} {asador.apellido}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{asador.experienciaAnos} años de experiencia</p>
                      </div>
                    </div>
                    <StarRating rating={asador.puntuacion} />
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                  <p className={`text-sm text-muted-foreground ${!isExpandido ? "line-clamp-2" : ""}`}>
                    {asador.descripcion}
                  </p>
                  {asador.descripcion.length > 100 && (
                    <button className="text-xs text-primary hover:underline"
                      onClick={() => setExpandido(isExpandido ? null : asador.idMaestro)}>
                      {isExpandido ? "Ver menos" : "Ver más"}
                    </button>
                  )}

                  <Separator />

                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span>Valor del servicio</span>
                      <span className="text-primary">{formatPrice(asador.valorServicio)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="size-3" />{asador.telefono}</span>
                    <span className="flex items-center gap-1"><Mail className="size-3" />{asador.correo}</span>
                  </div>
                </CardContent>

                <div className="p-4 pt-0">
                  {seleccionado ? (
                    <Button variant="outline" size="sm"
                      className="w-full text-destructive border-destructive hover:bg-destructive/10"
                      onClick={() => setAsadorSeleccionado(null)}>
                      <X className="size-4 mr-2" />Quitar selección
                    </Button>
                  ) : (
                    <Button size="sm" className="w-full" onClick={() => setAsadorSeleccionado(asador)}>
                      <UserCheck className="size-4 mr-2" />Seleccionar
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
