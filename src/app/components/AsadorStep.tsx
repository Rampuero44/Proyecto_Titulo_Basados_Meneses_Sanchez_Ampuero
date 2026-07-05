import { useState, useEffect } from "react";
import { Star, Phone, Mail, ChevronRight, X, UserCheck, Users, ClipboardList } from "lucide-react";
import { MaestroParrillero, obtenerMaestros } from "../services/asadoresApi";
import { ProductoSeleccionado } from "./ProductCatalogStep";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { formatPrice } from "../utils/format";


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

function ResumenProductos({
  seleccionados,
  cotizacionTotal,
}: {
  seleccionados: ProductoSeleccionado[];
  cotizacionTotal?: number;
}) {
  const total = cotizacionTotal ?? 0;
  const calorias = seleccionados.reduce(
    (sum, s) => sum + ((s.product.calorias ?? 0) * s.cantidad),
    0
  );
  if (seleccionados.length === 0) return null;

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3 h-full">
      <div className="flex items-center gap-2 font-semibold text-sm">
        <ClipboardList className="size-4" />
        Productos del evento
      </div>
      <div className="space-y-1 max-h-52 overflow-y-auto">
        {seleccionados.map((s) => (
          <div key={s.product.id} className="flex justify-between text-xs">
            <span className="truncate flex-1 mr-2 text-muted-foreground">{s.product.nombre}</span>
            <span className="shrink-0">×{s.cantidad}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-2 space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total productos</span>
          <span className="font-bold">{formatPrice(total)}</span>
        </div>
        {calorias > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Calorías</span>
            <span className="font-medium">{calorias.toLocaleString()} kcal</span>
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground pt-1 border-t">
        El costo del maestro asador se sumará aparte.
      </p>
    </div>
  );
}

function AsadorCard({
  asador,
  seleccionado,
  onSeleccionar,
  onDeseleccionar,
}: {
  asador: MaestroParrillero;
  seleccionado: boolean;
  onSeleccionar: () => void;
  onDeseleccionar: () => void;
}) {
  const [expandido, setExpandido] = useState(false);

  return (
    <Card className={`flex flex-col transition-all ${seleccionado ? "border-primary ring-1 ring-primary" : "hover:shadow-md"}`}>
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
        <p className={`text-sm text-muted-foreground ${!expandido ? "line-clamp-2" : ""}`}>
          {asador.descripcion}
        </p>
        {asador.descripcion.length > 100 && (
          <button className="text-xs text-primary hover:underline" onClick={() => setExpandido(!expandido)}>
            {expandido ? "Ver menos" : "Ver más"}
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
          <Button variant="outline" size="sm" className="w-full text-destructive border-destructive hover:bg-destructive/10" onClick={onDeseleccionar}>
            <X className="size-4 mr-2" />Quitar del evento
          </Button>
        ) : (
          <Button size="sm" className="w-full" onClick={onSeleccionar}>
            <UserCheck className="size-4 mr-2" />Contratar para el evento
          </Button>
        )}
      </div>
    </Card>
  );
}

interface Props {
  cantParticipantes: number;
  asadorSeleccionado: MaestroParrillero | null;
  onChange: (asador: MaestroParrillero | null) => void;
  seleccionados: ProductoSeleccionado[];
  cotizacionTotal?: number;
}

export function AsadorStep({ cantParticipantes, asadorSeleccionado, onChange, seleccionados, cotizacionTotal }: Props) {
  const [incluirServicio, setIncluirServicio] = useState<boolean | null>(
    asadorSeleccionado ? true : null
  );
  const [maestros, setMaestros] = useState<MaestroParrillero[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (incluirServicio === true && maestros.length === 0) {
      setCargando(true);
      obtenerMaestros()
        .then(setMaestros)
        .catch(() => setError("No se pudieron cargar los maestros asadores"))
        .finally(() => setCargando(false));
    }
  }, [incluirServicio]);

  if (incluirServicio === null) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Servicio de maestro asador</h2>
          <p className="text-muted-foreground text-sm mt-1">
            ¿Quieres contratar un maestro asador profesional para tu evento?
          </p>
        </div>
        <div className="flex gap-6 items-start">
          <div className="flex-1 grid gap-4 sm:grid-cols-2 place-items-center">
            <Card className="cursor-pointer hover:border-primary hover:shadow-md transition-all" onClick={() => setIncluirServicio(true)}>
              <CardContent className="pt-6 text-center space-y-3">
                <div className="text-4xl">👨‍🍳</div>
                <div>
                  <p className="font-semibold">Sí, quiero un maestro asador</p>
                  <p className="text-sm text-muted-foreground mt-1">Un profesional se encarga de todo. Tú solo disfruta.</p>
                </div>
                <ChevronRight className="size-5 mx-auto text-primary" />
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-primary hover:shadow-md transition-all" onClick={() => { setIncluirServicio(false); onChange(null); }}>
              <CardContent className="pt-6 text-center space-y-3">
                <div className="text-4xl">🔥</div>
                <div>
                  <p className="font-semibold">No, lo hacemos nosotros</p>
                  <p className="text-sm text-muted-foreground mt-1">El asado lo manejamos entre los participantes.</p>
                </div>
                <ChevronRight className="size-5 mx-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </div>
          <div className="hidden md:block w-64 shrink-0">
            <ResumenProductos seleccionados={seleccionados} cotizacionTotal={cotizacionTotal} />
          </div>
        </div>
        <div className="md:hidden">
          <ResumenProductos seleccionados={seleccionados} cotizacionTotal={cotizacionTotal} />
        </div>
      </div>
    );
  }

  if (incluirServicio === false) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Sin maestro asador</h2>
          <p className="text-muted-foreground text-sm mt-1">El asado lo manejarán los participantes.</p>
        </div>
        <ResumenProductos seleccionados={seleccionados} cotizacionTotal={cotizacionTotal} />
        <Button variant="outline" onClick={() => setIncluirServicio(null)}>Cambiar opción</Button>
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
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { setIncluirServicio(null); onChange(null); }}>Volver</Button>
      </div>

      {asadorSeleccionado && (
        <div className="flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-4">
          <UserCheck className="size-5 text-primary shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">{asadorSeleccionado.nombre} {asadorSeleccionado.apellido} seleccionado</p>
            <p className="text-xs text-muted-foreground">
              Valor del servicio: {formatPrice(asadorSeleccionado.valorServicio)}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3" />{cantParticipantes} personas
          </div>
        </div>
      )}

      {cargando && <p className="text-muted-foreground text-sm">Cargando maestros asadores...</p>}
      {error && <p className="text-destructive text-sm">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {maestros.map((asador) => (
          <AsadorCard
            key={asador.idMaestro}
            asador={asador}
            seleccionado={asadorSeleccionado?.idMaestro === asador.idMaestro}
            onSeleccionar={() => onChange(asador)}
            onDeseleccionar={() => onChange(null)}
          />
        ))}
      </div>
    </div>
  );
}
