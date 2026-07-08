import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { AlertTriangle, Calendar, Plus, X } from "lucide-react";
import { formatPrice } from "../utils/format";
import { Participante } from "../types/product";
import { ProductoSeleccionado } from "./ProductCatalogStep";
import { MaestroParrillero } from "../services/asadoresApi";

const formatCalories = (value: number) => `${Math.round(value).toLocaleString()} kcal`;

interface ConfigStepProps {
  seleccionados: ProductoSeleccionado[];
  edadVerificada: boolean;
  esMayor: boolean | null;
  costoTotal: number;
  cotizacionActiva: any | null;
  nombre: string;
  onNombreChange: (value: string) => void;
  fecha: string;
  onFechaChange: (value: string) => void;
  direccion: string;
  onDireccionChange: (value: string) => void;
  participantes: Participante[];
  nuevoParticipante: string;
  onNuevoParticipanteChange: (value: string) => void;
  onAgregarParticipante: () => void;
  onEliminarParticipante: (id: number) => void;
  asadorSeleccionado: MaestroParrillero | null;
  costoAsador: number;
  caloriasTotales: number;
  caloriasPorPersona: number;
  onEditarProductos: () => void;
  onBack: () => void;
  onContinue: () => void;
}

export function ConfigStep({
  seleccionados,
  edadVerificada,
  esMayor,
  costoTotal,
  cotizacionActiva,
  nombre,
  onNombreChange,
  fecha,
  onFechaChange,
  direccion,
  onDireccionChange,
  participantes,
  nuevoParticipante,
  onNuevoParticipanteChange,
  onAgregarParticipante,
  onEliminarParticipante,
  asadorSeleccionado,
  costoAsador,
  caloriasTotales,
  caloriasPorPersona,
  onEditarProductos,
  onBack,
  onContinue,
}: ConfigStepProps) {
  const fechaMinima = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración del evento</h1>
        <p className="mt-2 text-muted-foreground">Ponle nombre, fecha y agrega participantes.</p>
      </div>
      {edadVerificada && esMayor === false && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Alcohol restringido</p>
            <p className="text-sm text-amber-700">
              Las bebidas alcohólicas fueron retiradas de tu selección por ser menor de edad.
            </p>
          </div>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Productos seleccionados</CardTitle>
          <CardDescription>
            {seleccionados.length} productos · {formatPrice(costoTotal)} {!cotizacionActiva ? "(est.)" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {seleccionados.map((s) => (
              <div key={s.product.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                <span className="font-medium truncate flex-1 mr-2">{s.product.nombre}</span>
                <span className="text-muted-foreground shrink-0">×{s.cantidad}</span>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-3 text-muted-foreground" onClick={onEditarProductos}>
            Editar productos
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Datos del evento</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre-evento">Nombre del evento</Label>
              <Input id="nombre-evento" value={nombre} onChange={(e) => onNombreChange(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha-evento">Fecha</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fecha-evento"
                  type="date"
                  min={fechaMinima}
                  value={fecha}
                  onChange={(e) => onFechaChange(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="direccion-evento">
                ¿Dónde será el asado? <span className="text-primary">*</span>
              </Label>
              <Input
                id="direccion-evento"
                placeholder="Ej: Av. Las Condes 1234, Santiago"
                value={direccion}
                onChange={(e) => onDireccionChange(e.target.value)}
              />
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Participantes</h3>
                <p className="text-sm text-muted-foreground">El organizador siempre participa. Agrega al menos uno más 🔥</p>
              </div>
              <Badge variant="secondary">{participantes.length} asistentes</Badge>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                value={nuevoParticipante}
                onChange={(e) => onNuevoParticipanteChange(e.target.value)}
                placeholder="Nombre del participante"
                onKeyDown={(e) => e.key === "Enter" && onAgregarParticipante()}
              />
              <Button type="button" onClick={onAgregarParticipante}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {participantes.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{p.nombre}</p>
                    <p className="text-sm text-muted-foreground">{p.esOrganizador ? "Organizador" : "Participante"}</p>
                  </div>
                  {!p.esOrganizador && (
                    <Button variant="ghost" size="icon" onClick={() => onEliminarParticipante(p.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Costo productos</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{formatPrice(costoTotal)}</p>
            <p className="text-sm text-muted-foreground">
              {cotizacionActiva ? "Cotización seleccionada" : "Estimado — pendiente cotizar"}
            </p>
          </CardContent>
        </Card>
        {asadorSeleccionado && (
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader className="pb-2"><CardTitle className="text-base">Maestro asador</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-amber-700">{formatPrice(costoAsador)}</p>
              <p className="text-sm text-muted-foreground">{asadorSeleccionado.nombre}</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Calorías totales</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCalories(caloriasTotales)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Calorías por persona</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCalories(caloriasPorPersona)}</p>
          </CardContent>
        </Card>
      </div>
      <div className="fixed bottom-6 right-6 z-50 flex gap-3">
        <Button variant="outline" onClick={onBack}>Volver</Button>
        <Button onClick={onContinue}>
          Siguiente paso
        </Button>
      </div>
    </div>
  );
}