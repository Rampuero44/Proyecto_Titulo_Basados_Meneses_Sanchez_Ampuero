import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ShoppingCart, Trophy } from "lucide-react";
import { formatPrice } from "../utils/format";
import { IaCotizacion } from "./IaCotizacion";
import { ContextoEvento } from "./ModalContextoEvento";
import { ProductoSeleccionado } from "./ProductCatalogStep";

const formatCalories = (value: number) => `${Math.round(value).toLocaleString()} kcal`;

interface QuoteStepProps {
  cotizaciones: any[];
  cotizacionActiva: any | null;
  selectedComercio: string;
  onSelectComercio: (comercio: string) => void;
  caloriasTotales: number;
  caloriasPorPersona: number;
  contextoEvento: ContextoEvento | null;
  seleccionados: ProductoSeleccionado[];
  onBack: () => void;
  onContinue: () => void;
}

export function QuoteStep({
  cotizaciones,
  cotizacionActiva,
  selectedComercio,
  onSelectComercio,
  caloriasTotales,
  caloriasPorPersona,
  contextoEvento,
  seleccionados,
  onBack,
  onContinue,
}: QuoteStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <img
          src="/logo.png"
          alt="BASADOS"
          className="h-14 w-14 rounded-full object-contain bg-black p-1"
        />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cotización simulada</h1>
          <p className="mt-1 text-muted-foreground">
            Compara comercios y elige la mejor opción para tu asado.
          </p>
        </div>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {cotizaciones.map((cotizacion, index) => {
          const esSeleccionada = cotizacion.comercio === cotizacionActiva?.comercio;
          const esMejor = index === 0;
          return (
            <Card key={cotizacion.comercio} className={esSeleccionada ? "border-primary shadow-sm" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-xl">{cotizacion.comercio}</CardTitle>
                    <CardDescription>Simulación de canasta para este asado</CardDescription>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {esMejor && <Badge className="gap-1"><Trophy className="h-3.5 w-3.5" /> Más económico</Badge>}
                    {esSeleccionada && <Badge variant="outline">Seleccionado</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">Total comercio</p>
                  <p className="text-3xl font-bold text-primary">{formatPrice(Math.round(Number(cotizacion.total)))}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Alcohol incluido: {formatPrice(Math.round(0))}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  {cotizacion.items.slice(0, 5).map((detalle: any) => (
                    <div key={`${cotizacion.comercio}-${detalle.nombreProducto}`} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{detalle.nombreProducto}</span>
                      <span className="font-medium">
                        {detalle.subtotal !== null && detalle.subtotal !== undefined
                          ? formatPrice(Math.round(Number(detalle.subtotal)))
                          : "No disponible"}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  variant={esSeleccionada ? "default" : "outline"}
                  className="w-full"
                  onClick={() => onSelectComercio(cotizacion.comercio)}
                >
                  {esSeleccionada ? "Cotización activa" : "Usar esta cotización"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
        <div className="flex items-center justify-center rounded-xl border bg-muted/30">
          <img
            src="/logo.png"
            alt="BASADOS"
            className="w-48 object-contain opacity-80"
          />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Resumen de la cotización activa
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Total elegido</p>
            <p className="text-2xl font-bold">{formatPrice(Math.round(Number(cotizacionActiva?.total || 0)))}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Calorías totales</p>
            <p className="text-2xl font-bold">{formatCalories(caloriasTotales)}</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Calorías por persona</p>
            <p className="text-2xl font-bold">{formatCalories(caloriasPorPersona)}</p>
          </div>
        </CardContent>
      </Card>
      <div className="fixed bottom-6 right-6 z-50 flex gap-3">
        <Button variant="outline" onClick={onBack}>Volver a la configuración</Button>
        <Button onClick={onContinue}>Continuar a reparto de montos</Button>
      </div>
      {contextoEvento && (
        <IaCotizacion
          contexto={contextoEvento}
          productos={seleccionados.map((s) => ({
            nombre: s.product.nombre,
            cantidad: s.cantidad,
            slugCategoria: s.product.slugCategoria ?? s.product.categoria,
            precioUnitario: s.product.precioUnitario,
          }))}
          cotizaciones={cotizaciones.map((c) => ({
            comercio: c.comercio,
            total: Number(c.total),
          }))}
        />
      )}
    </div>
  );
}
