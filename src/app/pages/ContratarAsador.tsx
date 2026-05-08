import { useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { ArrowLeft, Star, Phone, Mail, MapPin, CreditCard, UserCheck, X } from "lucide-react";
import { mockAsadores, Asador } from "../data/mockAsadores";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(price);

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
  const [asadorSeleccionado, setAsadorSeleccionado] = useState<Asador | null>(null);
  const [personas, setPersonas] = useState(10);
  const [expandido, setExpandido] = useState<number | null>(null);

  const handleContratar = () => {
    if (!asadorSeleccionado) {
      toast.error("Selecciona un maestro asador para continuar");
      return;
    }
    toast.success(`¡${asadorSeleccionado.nombre} contactado! Te llegará un correo con los detalles.`);
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

        {/* Selector de personas */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-lg border bg-muted/30">
          <span className="text-sm font-medium">¿Cuántas personas serán?</span>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="size-8" onClick={() => setPersonas(Math.max(1, personas - 1))}>-</Button>
            <span className="w-8 text-center font-bold">{personas}</span>
            <Button variant="outline" size="icon" className="size-8" onClick={() => setPersonas(personas + 1)}>+</Button>
          </div>
          <span className="text-sm text-muted-foreground">Las tarifas se calculan según este número</span>
        </div>

        {/* Asador seleccionado */}
        {asadorSeleccionado && (
          <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-4 mb-6">
            <UserCheck className="size-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{asadorSeleccionado.nombre} seleccionado</p>
              <p className="text-sm text-muted-foreground">
                Tarifa estimada: {formatPrice(asadorSeleccionado.tarifaBase + asadorSeleccionado.tarifaPorPersona * personas)} para {personas} personas
              </p>
            </div>
            <Button size="sm" onClick={handleContratar}>
              Confirmar contratación
            </Button>
          </div>
        )}

        {/* Grilla de asadores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockAsadores.map((asador) => {
            const seleccionado = asadorSeleccionado?.id === asador.id;
            const isExpandido = expandido === asador.id;
            const tarifaTotal = asador.tarifaBase + asador.tarifaPorPersona * personas;

            return (
              <Card key={asador.id} className={`flex flex-col transition-all ${seleccionado ? "border-primary ring-1 ring-primary" : "hover:shadow-md"}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-xl font-bold shrink-0">
                        {asador.nombre.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-base leading-tight">{asador.nombre}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">{asador.redSocial}</p>
                      </div>
                    </div>
                    <StarRating rating={asador.calificacion} />
                  </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                  <p className={`text-sm text-muted-foreground ${!isExpandido ? "line-clamp-2" : ""}`}>
                    {asador.descripcion}
                  </p>
                  {asador.descripcion.length > 100 && (
                    <button className="text-xs text-primary hover:underline" onClick={() => setExpandido(isExpandido ? null : asador.id)}>
                      {isExpandido ? "Ver menos" : "Ver más"}
                    </button>
                  )}

                  <Separator />

                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">
                      {asador.zonas[0]?.comunas.slice(0, 3).join(", ")}
                      {asador.zonas[0]?.comunas.length > 3 && ` +${asador.zonas[0].comunas.length - 3} más`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <CreditCard className="size-4 text-muted-foreground shrink-0" />
                    {asador.formasPago.map((fp) => (
                      <Badge key={fp} variant="secondary" className="text-xs">{fp}</Badge>
                    ))}
                  </div>

                  <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tarifa base</span>
                      <span className="font-medium">{formatPrice(asador.tarifaBase)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Por persona ({personas})</span>
                      <span className="font-medium">{formatPrice(asador.tarifaPorPersona * personas)}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between text-sm font-bold">
                      <span>Total estimado</span>
                      <span className="text-primary">{formatPrice(tarifaTotal)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="size-3" />{asador.telefono}</span>
                    <span className="flex items-center gap-1"><Mail className="size-3" />{asador.correo}</span>
                  </div>
                </CardContent>

                <div className="p-4 pt-0">
                  {seleccionado ? (
                    <Button variant="outline" size="sm" className="w-full text-destructive border-destructive hover:bg-destructive/10" onClick={() => setAsadorSeleccionado(null)}>
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