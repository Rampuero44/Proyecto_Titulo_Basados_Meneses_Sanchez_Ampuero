import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  Users,
  DollarSign,
  Beef,
  Beer,
  Flame,
  Salad,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Store,
  Activity,
  Send,
} from "lucide-react";
import { storage, Evento } from "../utils/localStorage";
import { toast } from "sonner";
import { formatearCantidad, formatearFecha, obtenerUnidadItem } from "../utils/format";
import { enviarResumenEvento } from "../services/notificacionApi";

const getTotalCaloriesFromEvento = (evento: Evento) => {
  if (typeof evento.caloriasTotales === "number") return evento.caloriasTotales;

  return [...evento.proteinas, ...evento.bebestibles, ...evento.insumos, ...evento.ensaladas]
    .reduce((sum, item) => sum + item.cantidad * (item.calorias || 0), 0);
};

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [enviandoResumen, setEnviandoResumen] = useState(false);
  const currentUsuario = storage.getCurrentUsuario();

  useEffect(() => {
    if (!currentUsuario) {
      navigate("/login");
      return;
    }

    if (!id) {
      navigate("/dashboard");
      return;
    }

    const foundEvento = storage.getEventoById(Number(id));
    if (!foundEvento) {
      toast.error("Evento no encontrado");
      navigate("/dashboard");
      return;
    }

    const puedeVerEvento = foundEvento.usuarioId === currentUsuario.id || currentUsuario.rol === "admin";
    if (!puedeVerEvento) {
      toast.error("Este evento no pertenece a tu cuenta");
      navigate("/dashboard");
      return;
    }

    setEvento(foundEvento);
  }, [id, currentUsuario, navigate]);

  const handleCambiarEstado = (nuevoEstado: "planificado" | "confirmado" | "finalizado") => {
    if (!evento) return;

    const eventoActualizado = { ...evento, estado: nuevoEstado };
    storage.updateEvento(evento.id, eventoActualizado);
    setEvento(eventoActualizado);
    toast.success(`Evento ${nuevoEstado}`);
  };

  const costoTotal = evento?.presupuesto || 0;
  const costoPromedio = evento && evento.participantes.length > 0 ? costoTotal / evento.participantes.length : 0;
  const caloriasTotales = evento ? getTotalCaloriesFromEvento(evento) : 0;
  const caloriasPorPersona = evento && evento.participantes.length > 0
    ? (evento.caloriasPorPersona || caloriasTotales / evento.participantes.length)
    : 0;

  const totalParticipantes = useMemo(
    () => Math.round((evento?.participantes || []).reduce((acc, participante) => acc + (participante.monto || 0), 0)),
    [evento],
  );

  const cotizacionSeleccionada = evento?.cotizaciones?.find(
    (cotizacion) => cotizacion.supermercado === evento.cotizacionSeleccionada,
  ) || evento?.cotizaciones?.[0];

  const construirPayloadResumen = () => {
    if (!evento || !currentUsuario) return null;

    const destinatarios = evento.participantes
      .filter((participante) => participante.metodoContacto !== "sin_notificacion")
      .filter((participante) => participante.contacto && participante.contacto.trim() !== "")
      .map((participante) => ({
        nombre: participante.nombre,
        canal: participante.metodoContacto === "telefono" ? "whatsapp" as const : "email" as const,
        destino: participante.contacto!.trim(),
        monto: participante.monto ?? Math.round(costoPromedio),
      }));

    return {
      eventoId: evento.id,
      nombreEvento: evento.nombre,
      fecha: evento.fecha,
      organizador: currentUsuario.nombre,
      participantes: evento.participantes.length,
      costoTotal: Math.round(costoTotal),
      costoPromedio: Math.round(costoPromedio),
      caloriasTotales: Math.round(caloriasTotales),
      caloriasPorPersona: Math.round(caloriasPorPersona),
      cotizacionSeleccionada: evento.cotizacionSeleccionada || cotizacionSeleccionada?.supermercado || "",
      destinatarios,
    };
  };

  const handleEnviarResumen = async () => {
    try {
      if (!evento) {
        toast.error("No hay evento cargado");
        return;
      }

      const payload = construirPayloadResumen();

      if (!payload) {
        toast.error("No se pudo construir el resumen del evento");
        return;
      }

      if (payload.destinatarios.length === 0) {
        toast.error("No hay participantes con correo o teléfono configurado");
        return;
      }

      setEnviandoResumen(true);

      const resultado = await enviarResumenEvento(payload);

      const enviadosWhatsapp = resultado?.enviadosWhatsapp ?? 0;
      const enviadosEmail = resultado?.enviadosEmail ?? 0;

      toast.success(
        `Resumen enviado. WhatsApp: ${enviadosWhatsapp}, Correo: ${enviadosEmail}`
      );
    } catch (error) {
      console.error("Error al enviar resumen:", error);
      toast.error("Error al enviar el resumen del evento");
    } finally {
      setEnviandoResumen(false);
    }
  };

  if (!evento || !currentUsuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        <div className="mb-8">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{evento.nombre}</h1>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={handleEnviarResumen} disabled={enviandoResumen}>
                <Send className="mr-2 h-4 w-4" />
                {enviandoResumen ? "Enviando..." : "Enviar resumen"}
              </Button>

              <Badge variant={evento.estado === "finalizado" ? "outline" : evento.estado === "confirmado" ? "default" : "secondary"}>
                {evento.estado.charAt(0).toUpperCase() + evento.estado.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatearFecha(evento.fecha)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{evento.participantes.length} participantes</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>${costoTotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>{Math.round(caloriasTotales).toLocaleString()} kcal</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="insumos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="insumos">Insumos</TabsTrigger>
            <TabsTrigger value="participantes">Participantes</TabsTrigger>
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
          </TabsList>

          <TabsContent value="insumos" className="space-y-6">
            {[
              { titulo: "Proteínas", icon: <Beef className="h-5 w-5" />, items: evento.proteinas },
              { titulo: "Bebestibles", icon: <Beer className="h-5 w-5" />, items: evento.bebestibles },
              { titulo: "Insumos", icon: <Flame className="h-5 w-5" />, items: evento.insumos },
              { titulo: "Ensaladas", icon: <Salad className="h-5 w-5" />, items: evento.ensaladas },
            ].map((bloque) => (
              <Card key={bloque.titulo}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {bloque.icon}
                    {bloque.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bloque.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b py-2 last:border-0">
                        <div>
                          <p className="font-medium">{item.nombre}</p>
                          <p className="text-sm text-muted-foreground">{item.tipo}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.calorias
                              ? `${Math.round(item.calorias).toLocaleString()} kcal por unidad base`
                              : "Sin aporte calórico relevante"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatearCantidad(item.cantidad, obtenerUnidadItem(item.nombre, item.tipo))}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${(item.cantidad * item.porPrecio).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {Math.round(item.cantidad * (item.calorias || 0)).toLocaleString()} kcal
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="participantes">
            <Card>
              <CardHeader>
                <CardTitle>Participantes y reparto</CardTitle>
                <CardDescription>
                  Aquí queda el historial del reparto, método de contacto y monto asignado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evento.participantes.map((participante, index) => (
                    <div key={participante.id} className="rounded-lg border p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium">{participante.nombre}</span>
                              {participante.esOrganizador && <Badge variant="secondary">Organizador</Badge>}
                              {participante.sinAlcohol && <Badge variant="outline">Sin alcohol</Badge>}
                              {participante.montoManual && <Badge>Manual</Badge>}
                            </div>

                            <p className="text-sm text-muted-foreground">
                              Método: {participante.metodoContacto === "correo"
                                ? "Correo"
                                : participante.metodoContacto === "telefono"
                                  ? "Teléfono"
                                  : "Sin notificación"}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {participante.metodoContacto === "correo" && <Mail className="h-4 w-4" />}
                              {participante.metodoContacto === "telefono" && <Phone className="h-4 w-4" />}
                              <span>Contacto: {participante.contacto?.trim() || "No registrado"}</span>
                            </div>
                          </div>
                        </div>

                        <Badge variant="outline">
                          ${(participante.monto ?? costoPromedio).toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resumen">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de costos y calorías</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Total proteínas</span>
                    <span className="font-semibold">
                      ${evento.proteinas.reduce((sum, p) => sum + p.cantidad * p.porPrecio, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Total bebestibles</span>
                    <span className="font-semibold">
                      ${evento.bebestibles.reduce((sum, b) => sum + b.cantidad * b.porPrecio, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Total insumos</span>
                    <span className="font-semibold">
                      ${evento.insumos.reduce((sum, i) => sum + i.cantidad * i.porPrecio, 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-b py-2">
                    <span className="text-muted-foreground">Total ensaladas</span>
                    <span className="font-semibold">
                      ${evento.ensaladas.reduce((sum, e) => sum + e.cantidad * e.porPrecio, 0).toLocaleString()}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between py-2">
                    <span className="font-semibold">Total general</span>
                    <span className="font-bold text-lg text-primary">${costoTotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between rounded-lg bg-muted p-3 py-2">
                    <span className="font-medium">Calorías totales</span>
                    <span className="font-bold text-primary">
                      {Math.round(caloriasTotales).toLocaleString()} kcal
                    </span>
                  </div>

                  <div className="flex justify-between rounded-lg bg-muted p-3 py-2">
                    <span className="font-medium">Calorías por persona</span>
                    <span className="font-bold text-primary">
                      {Math.round(caloriasPorPersona).toLocaleString()} kcal
                    </span>
                  </div>

                  <div className="flex justify-between rounded-lg bg-muted p-3 py-2">
                    <span className="font-medium">Suma del reparto</span>
                    <span className="font-bold text-primary">${totalParticipantes.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between rounded-lg bg-muted p-3 py-2">
                    <span className="font-medium">Promedio por persona</span>
                    <span className="font-bold text-primary">
                      ${Math.round(costoPromedio).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Estado del evento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Button
                        variant={evento.estado === "planificado" ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleCambiarEstado("planificado")}
                      >
                        {evento.estado === "planificado"
                          ? <CheckCircle2 className="mr-2 h-4 w-4" />
                          : <XCircle className="mr-2 h-4 w-4" />}
                        Planificado
                      </Button>

                      <Button
                        variant={evento.estado === "confirmado" ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleCambiarEstado("confirmado")}
                      >
                        {evento.estado === "confirmado"
                          ? <CheckCircle2 className="mr-2 h-4 w-4" />
                          : <XCircle className="mr-2 h-4 w-4" />}
                        Confirmado
                      </Button>

                      <Button
                        variant={evento.estado === "finalizado" ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => handleCambiarEstado("finalizado")}
                      >
                        {evento.estado === "finalizado"
                          ? <CheckCircle2 className="mr-2 h-4 w-4" />
                          : <XCircle className="mr-2 h-4 w-4" />}
                        Finalizado
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {cotizacionSeleccionada && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        Cotización simulada elegida
                      </CardTitle>
                      <CardDescription>
                        Mejor opción destacada para esta compra simulada.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm text-muted-foreground">Supermercado seleccionado</p>
                        <p className="text-2xl font-bold text-primary">{cotizacionSeleccionada.supermercado}</p>
                        <p className="text-sm text-muted-foreground">
                          Total: ${Math.round(cotizacionSeleccionada.total).toLocaleString()}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        {cotizacionSeleccionada.detalles.slice(0, 6).map((detalle) => (
                          <div
                            key={`${cotizacionSeleccionada.supermercado}-${detalle.nombre}`}
                            className="flex justify-between"
                          >
                            <span className="text-muted-foreground">{detalle.nombre}</span>
                            <span className="font-medium">
                              ${Math.round(detalle.subtotal).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}