import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowLeft, Calendar, Users, DollarSign, ShoppingCart, Store, CheckCircle2, XCircle, Send, Download } from "lucide-react";
import { toast } from "sonner";
import { formatearFecha, formatPrice } from "../utils/format";
import { useAuth } from "../context/AuthContext";
import { actualizarEvento, obtenerDetalleEvento } from "../services/eventosApi";
import { descargarResumenPdf } from "../services/notificacionApi";


const SLUG_LABEL: Record<string, string> = {
  "vacunos": "Proteína", "pollo": "Proteína", "cerdos": "Proteína",
  "embutidos-parrilleros": "Proteína", "pescados-y-mariscos": "Proteína",
  "bebidas-y-licores": "Bebestible", "bebidas-sin-alcohol": "Bebestible",
  "verduras": "Ensalada",
  "snacks-y-picoteo": "Insumo", "aceites-y-condimentos": "Insumo",
};

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [evento, setEvento] = useState<any | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [descargandoPdf, setDescargandoPdf] = useState(false);

useEffect(() => {
    if (loading) return;
    if (!id) { navigate("/dashboard"); return; }

    obtenerDetalleEvento(id)
      .then(setEvento)
      .catch(() => { toast.error("Evento no encontrado"); navigate("/dashboard"); });
  }, [id, loading, navigate]);


  const handleCambiarEstado = async (nuevoEstado: string) => {
    if (!evento) return;
    try {
      await actualizarEvento(evento.id, { estado: nuevoEstado });
      setEvento({ ...evento, estado: nuevoEstado });
      toast.success(`Estado actualizado a ${nuevoEstado}`);
    } catch {
      toast.error("Error actualizando estado");
    }
  };

  const totalProductos = evento?.productos?.reduce((sum: number, p: any) => {
    const precio = p.precioUnitario ?? 0;
    return sum + precio * (p.cantidad ?? 1);
  }, 0) ?? 0;

  const costoAsador = evento?.contratacion?.valorAcordado ?? 0;
  const totalGeneral = totalProductos + costoAsador;

  const totalAportes = evento?.participantes?.reduce((sum: number, p: any) =>
    sum + (p.aporte ?? 0), 0) ?? 0;

  const handleDescargarPdf = async () => {
    if (!evento) return;
    setDescargandoPdf(true);
    try {
      const comercios = (evento.productos ?? [])
        .map((p: any) => p.comercio)
        .filter(Boolean);
      const comercioMasFrecuente = comercios.length
        ? comercios.sort((a: string, b: string) =>
            comercios.filter((c: string) => c === b).length -
            comercios.filter((c: string) => c === a).length
          )[0]
        : "No definido";

      await descargarResumenPdf({
        eventoId: evento.id,
        nombreEvento: evento.nombre,
        fecha: evento.fechaEvento ? formatearFecha(evento.fechaEvento) : "Sin fecha",
        organizador: evento.organizador ?? "",
        organizadorEmail: user?.email ?? "",
        participantes: evento.cantidadPersonas ?? 0,
        costoTotal: Math.round(totalGeneral),
        costoPromedio: Math.round(evento.cantidadPersonas ? totalGeneral / evento.cantidadPersonas : 0),
        caloriasTotales: 0,
        caloriasPorPersona: 0,
        cotizacionSeleccionada: comercioMasFrecuente,
        direccion: evento.direccion ?? "",
        destinatarios: [],
      });
      toast.success("PDF descargado");
    } catch {
      toast.error("No se pudo descargar el PDF");
    } finally {
      setDescargandoPdf(false);
    }
  };

  if (loading || !evento) return null;

  const estados = ["BORRADOR", "PLANIFICANDO", "CONFIRMADO", "FINALIZADO"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
        </Button>

        <div className="mb-8">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{evento.nombre}</h1>
            <div className="flex items-center gap-3">
              <Badge variant={evento.estado === "FINALIZADO" ? "outline" : evento.estado === "CONFIRMADO" ? "default" : "secondary"}>
                {evento.estado}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleDescargarPdf} disabled={descargandoPdf}>
                <Download className="mr-2 h-4 w-4" />
                {descargandoPdf ? "Generando..." : "Descargar PDF"}
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{evento.fechaEvento ? formatearFecha(evento.fechaEvento) : "Sin fecha"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{evento.cantidadPersonas ?? 0} participantes</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>{formatPrice(evento.presupuesto ?? 0)}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="productos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="productos">Productos</TabsTrigger>
            <TabsTrigger value="participantes">Participantes</TabsTrigger>
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="cotizaciones">Cotizaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="productos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" /> Productos del evento
                </CardTitle>
                <CardDescription>
                  Productos seleccionados para la cotización
                </CardDescription>
              </CardHeader>
              <CardContent>
                {evento.productos?.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Sin productos registrados</p>
                ) : (
                  <div className="space-y-2">
                    {evento.productos?.map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between border-b py-2 last:border-0">
                        <div>
                          <p className="font-medium">{p.nombre}</p>
                          <p className="text-xs text-muted-foreground">
                            {SLUG_LABEL[p.slugCategoria] ?? p.slugCategoria}
                            {p.comercio ? ` · ${p.comercio}` : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">x{p.cantidad}</p>
                          {p.precioUnitario && (
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(p.precioUnitario * p.cantidad)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 font-bold">
                      <span>Total estimado</span>
                      <span className="text-primary">{formatPrice(totalProductos)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="participantes">
            <Card>
              <CardHeader>
                <CardTitle>Participantes y aportes</CardTitle>
              </CardHeader>
              <CardContent>
                {evento.participantes?.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Sin participantes registrados</p>
                ) : (
                  <div className="space-y-3">
                    {evento.participantes?.map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                            {i + 1}
                          </div>
                          <div>
                            <p className="font-medium">{p.nombre}</p>
                            <p className="text-xs text-muted-foreground">{p.rol ?? "PARTICIPANTE"}</p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {p.aporte ? formatPrice(p.aporte) : "Sin aporte"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cotizaciones">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" /> Precios por comercio
                </CardTitle>
                <CardDescription>
                  Precios de los productos en cada supermercado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {evento.productos?.filter((p: any) => p.comercio).length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">Sin información de precios disponible</p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(
                      (evento.productos ?? [])
                        .filter((p: any) => p.comercio && p.precioUnitario)
                        .reduce((acc: any, p: any) => {
                          if (!acc[p.comercio]) acc[p.comercio] = { productos: [], total: 0 };
                          acc[p.comercio].productos.push(p);
                          acc[p.comercio].total += (p.precioUnitario ?? 0) * (p.cantidad ?? 1);
                          return acc;
                        }, {})
                    ).map(([comercio, data]: [string, any]) => (
                      <div key={comercio} className="rounded-lg border p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold">{comercio}</p>
                          <span className="text-primary font-bold">{formatPrice(data.total)}</span>
                        </div>
                        <div className="space-y-1">
                          {data.productos.map((p: any, i: number) => (
                            <div key={i} className="flex justify-between text-sm text-muted-foreground">
                              <span>{p.nombre} x{p.cantidad}</span>
                              <span>{formatPrice((p.precioUnitario ?? 0) * (p.cantidad ?? 1))}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resumen">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Resumen de costos</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Total productos</span>
                    <span className="font-semibold">{formatPrice(totalProductos)}</span>
                  </div>
                  {evento.contratacion && (
                    <div className="flex justify-between border-b py-2">
                      <span className="text-muted-foreground">
                        Maestro asador ({evento.contratacion.nombreMaestro})
                      </span>
                      <span className="font-semibold">{formatPrice(evento.contratacion.valorAcordado)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Presupuesto</span>
                    <span className="font-semibold">{formatPrice(evento.presupuesto ?? 0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between border-b py-2">
                    <span className="font-semibold">Total a repartir</span>
                    <span className="font-bold text-lg text-primary">{formatPrice(totalGeneral)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Suma de aportes</span>
                    <span className="font-semibold">{formatPrice(totalAportes)}</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-muted p-3">
                    <span className="font-medium">Promedio por persona</span>
                    <span className="font-bold text-primary">
                      {formatPrice(evento.cantidadPersonas ? totalGeneral / evento.cantidadPersonas : 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Estado del evento</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {estados.map((estado) => (
                    <Button
                      key={estado}
                      variant={evento.estado === estado ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleCambiarEstado(estado)}
                    >
                      {evento.estado === estado
                        ? <CheckCircle2 className="mr-2 h-4 w-4" />
                        : <XCircle className="mr-2 h-4 w-4" />}
                      {estado.charAt(0) + estado.slice(1).toLowerCase()}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}