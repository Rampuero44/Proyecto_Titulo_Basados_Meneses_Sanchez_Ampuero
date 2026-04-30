import { useState } from "react";
import { Star, Phone, Mail, MapPin, CreditCard, ChevronRight, X, UserCheck, Users } from "lucide-react";
import { mockAsadores, Asador } from "../data/mockAsadores";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(price);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`size-4 ${star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
      />
    ))}
    <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
  </div>
);

// ─── Card del asador ─────────────────────────────────────────────────────────

function AsadorCard({
  asador,
  seleccionado,
  cantParticipantes,
  onSeleccionar,
  onDeseleccionar,
}: {
  asador: Asador;
  seleccionado: boolean;
  cantParticipantes: number;
  onSeleccionar: () => void;
  onDeseleccionar: () => void;
}) {
  const [expandido, setExpandido] = useState(false);
  const tarifaTotal = asador.tarifaBase + asador.tarifaPorPersona * cantParticipantes;

  return (
    <Card className={`flex flex-col transition-all ${seleccionado ? "border-primary ring-1 ring-primary" : "hover:shadow-md"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar placeholder */}
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
        {/* Descripción */}
        <p className={`text-sm text-muted-foreground ${!expandido ? "line-clamp-2" : ""}`}>
          {asador.descripcion}
        </p>
        {asador.descripcion.length > 100 && (
          <button
            className="text-xs text-primary hover:underline"
            onClick={() => setExpandido(!expandido)}
          >
            {expandido ? "Ver menos" : "Ver más"}
          </button>
        )}

        <Separator />

        {/* Zonas */}
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
          <span className="text-muted-foreground">
            {asador.zonas[0]?.comunas.slice(0, 3).join(", ")}
            {asador.zonas[0]?.comunas.length > 3 && ` +${asador.zonas[0].comunas.length - 3} más`}
          </span>
        </div>

        {/* Formas de pago */}
        <div className="flex items-center gap-2 flex-wrap">
          <CreditCard className="size-4 text-muted-foreground shrink-0" />
          {asador.formasPago.map((fp) => (
            <Badge key={fp} variant="secondary" className="text-xs">{fp}</Badge>
          ))}
        </div>

        {/* Tarifa */}
        <div className="rounded-lg bg-muted/50 p-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tarifa base</span>
            <span className="font-medium">{formatPrice(asador.tarifaBase)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Por persona ({cantParticipantes})</span>
            <span className="font-medium">{formatPrice(asador.tarifaPorPersona * cantParticipantes)}</span>
          </div>
          <Separator className="my-1" />
          <div className="flex justify-between text-sm font-bold">
            <span>Total estimado</span>
            <span className="text-primary">{formatPrice(tarifaTotal)}</span>
          </div>
        </div>

        {/* Contacto */}
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Phone className="size-3" />{asador.telefono}</span>
          <span className="flex items-center gap-1"><Mail className="size-3" />{asador.correo}</span>
        </div>
      </CardContent>

      <div className="p-4 pt-0">
        {seleccionado ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-destructive border-destructive hover:bg-destructive/10"
            onClick={onDeseleccionar}
          >
            <X className="size-4 mr-2" />
            Quitar del evento
          </Button>
        ) : (
          <Button size="sm" className="w-full" onClick={onSeleccionar}>
            <UserCheck className="size-4 mr-2" />
            Contratar para el evento
          </Button>
        )}
      </div>
    </Card>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface Props {
  cantParticipantes: number;
  asadorSeleccionado: Asador | null;
  onChange: (asador: Asador | null) => void;
}

export function AsadorStep({ cantParticipantes, asadorSeleccionado, onChange }: Props) {
  const [incluirServicio, setIncluirServicio] = useState<boolean | null>(
    asadorSeleccionado ? true : null
  );

  // Paso 1: preguntar si desea el servicio
  if (incluirServicio === null) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Servicio de maestro asador</h2>
          <p className="text-muted-foreground text-sm mt-1">
            ¿Quieres contratar un maestro asador profesional para tu evento?
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 max-w-xl">
          <Card
            className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
            onClick={() => setIncluirServicio(true)}
          >
            <CardContent className="pt-6 text-center space-y-3">
              <div className="text-4xl">👨‍🍳</div>
              <div>
                <p className="font-semibold">Sí, quiero un maestro asador</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Un profesional se encarga de todo. Tú solo disfruta.
                </p>
              </div>
              <ChevronRight className="size-5 mx-auto text-primary" />
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
            onClick={() => { setIncluirServicio(false); onChange(null); }}
          >
            <CardContent className="pt-6 text-center space-y-3">
              <div className="text-4xl">🔥</div>
              <div>
                <p className="font-semibold">No, lo hacemos nosotros</p>
                <p className="text-sm text-muted-foreground mt-1">
                  El asado lo manejamos entre los participantes.
                </p>
              </div>
              <ChevronRight className="size-5 mx-auto text-muted-foreground" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Paso 2: mostrar lista de asadores
  if (incluirServicio === false) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Sin maestro asador</h2>
          <p className="text-muted-foreground text-sm mt-1">
            El asado lo manejarán los participantes. Puedes cambiar esta opción si quieres.
          </p>
        </div>
        <Button variant="outline" onClick={() => setIncluirServicio(null)}>
          Cambiar opción
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Elige tu maestro asador</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Selecciona el profesional que más se adapte a tu evento.
            El costo se mostrará separado del presupuesto de productos.
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { setIncluirServicio(null); onChange(null); }}>
          Volver
        </Button>
      </div>

      {/* Resumen si ya hay uno seleccionado */}
      {asadorSeleccionado && (
        <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-4">
          <UserCheck className="size-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">{asadorSeleccionado.nombre} seleccionado</p>
            <p className="text-xs text-muted-foreground">
              Tarifa estimada: {formatPrice(asadorSeleccionado.tarifaBase + asadorSeleccionado.tarifaPorPersona * cantParticipantes)}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3" />
            {cantParticipantes} personas
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAsadores.map((asador) => (
          <AsadorCard
            key={asador.id}
            asador={asador}
            seleccionado={asadorSeleccionado?.id === asador.id}
            cantParticipantes={cantParticipantes}
            onSeleccionar={() => onChange(asador)}
            onDeseleccionar={() => onChange(null)}
          />
        ))}
      </div>
    </div>
  );
}
